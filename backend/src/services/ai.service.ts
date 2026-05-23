import { env } from '../config/env.js'
import { mapCommitToListItemDTO } from '../mappers/commit.mapper.js'
import { commitRepository } from '../repositories/commit.repository.js'
import { repositoryRepository } from '../repositories/repository.repository.js'
import { userRepository } from '../repositories/user.repository.js'
import type { AuthenticatedUser, GeneratedPostPreviewDTO } from '../types/dto.js'
import { truncateDiff } from '../utils/truncateDiff.js'
import { githubService } from './github.service.js'

type GeneratePostInput = {
  currentUser: AuthenticatedUser
  repositoryId: string
  branchName: string
  commitShas: string[]
}

class AIService {
  buildPrompt(input: {
    repositoryName: string
    branchName: string
    commitMessages: string[]
    changedFiles: string[]
    diff: string
  }) {
    return [
      'Write an internal engineering blog draft from these commits.',
      'Do not invent any detail not supported by the commit data or diff.',
      `Repository: ${input.repositoryName}`,
      `Branch: ${input.branchName}`,
      `Commit messages: ${input.commitMessages.join(' | ')}`,
      `Changed files: ${input.changedFiles.join(', ') || 'None'}`,
      'Diff:',
      truncateDiff(input.diff),
    ].join('\n')
  }

  private buildPreviewFallback(input: {
    repositoryName: string
    branchName: string
    commitMessages: string[]
    changedFiles: string[]
    sourceCommits: GeneratedPostPreviewDTO['sourceCommits']
  }): GeneratedPostPreviewDTO {
    return {
      title: `${input.repositoryName}: ${input.commitMessages[0] ?? 'Engineering update'}`,
      summary: `A draft preview generated from ${input.sourceCommits.length} commit(s) on ${input.branchName}, touching ${input.changedFiles.length} file(s).`,
      body: [
        `This draft is based on ${input.sourceCommits.length} selected commit(s) in ${input.repositoryName}.`,
        '',
        'Commit highlights:',
        ...input.commitMessages.map((message) => `- ${message}`),
        '',
        'Files changed:',
        ...input.changedFiles.map((file) => `- ${file}`),
        '',
        'This content should be refined before publishing, but it stays grounded in the selected commits.',
      ].join('\n'),
      tags: ['engineering', 'github', 'draft'],
      sourceCommits: input.sourceCommits,
      generationMode: 'fallback',
    }
  }

  private async generateWithOpenAI(prompt: string) {
    if (!env.OPENAI_API_KEY) {
      return null
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You write concise internal engineering blog drafts. Return valid JSON with keys title, summary, body, tags.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}.`)
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string
        }
      }>
    }

    const content = payload.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('OpenAI response was empty.')
    }

    const parsed = JSON.parse(content) as {
      title?: string
      summary?: string
      body?: string
      tags?: unknown
    }

    return {
      title: parsed.title?.trim() ?? '',
      summary: parsed.summary?.trim() ?? '',
      body: parsed.body?.trim() ?? '',
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.filter((tag): tag is string => typeof tag === 'string')
        : [],
    }
  }

  async generatePostPreview(input: GeneratePostInput): Promise<GeneratedPostPreviewDTO> {
    const user = await userRepository.ensureUser(input.currentUser)
    const repository = await githubService.getRepositoryOrThrow(input.repositoryId)
    const commitDetails = await Promise.all(
      input.commitShas.map((sha) =>
        githubService.getCommitDetail(input.repositoryId, sha),
      ),
    )

    const persistedRepository = await repositoryRepository.upsertRepository({
      userId: user.id,
      githubRepoId: repository.id,
      owner: repository.owner,
      name: repository.name,
      defaultBranch: repository.defaultBranch,
    })

    await Promise.all(
      commitDetails.map((commitDetail) =>
        commitRepository.upsertCommit({
          repositoryId: persistedRepository.id,
          sha: commitDetail.sha,
          message: commitDetail.message,
          authorName: commitDetail.authorName,
          authorEmail: commitDetail.authorEmail,
          authoredAt: new Date(commitDetail.authoredAt),
        }),
      ),
    )

    const sourceCommits = commitDetails.map((commitDetail) =>
      mapCommitToListItemDTO({
        sha: commitDetail.sha,
        message: commitDetail.message,
        authorName: commitDetail.authorName,
        authoredAt: new Date(commitDetail.authoredAt),
      }),
    )
    const changedFiles = Array.from(
      new Set(commitDetails.flatMap((commitDetail) => commitDetail.changedFiles)),
    )
    const prompt = this.buildPrompt({
      repositoryName: repository.fullName,
      branchName: input.branchName,
      commitMessages: commitDetails.map((commitDetail) => commitDetail.message),
      changedFiles,
      diff: commitDetails
        .map((commitDetail) => `Commit ${commitDetail.shortSha}\n${commitDetail.diff}`)
        .join('\n\n'),
    })

    try {
      const aiDraft = await this.generateWithOpenAI(prompt)

      if (aiDraft?.title && aiDraft.body) {
        return {
          title: aiDraft.title,
          summary: aiDraft.summary || 'AI-generated draft preview.',
          body: aiDraft.body,
          tags: aiDraft.tags,
          sourceCommits,
          generationMode: 'openai',
        }
      }
    } catch {
      // Fall through to the deterministic preview below.
    }

    return this.buildPreviewFallback({
      repositoryName: repository.fullName,
      branchName: input.branchName,
      commitMessages: commitDetails.map((commitDetail) => commitDetail.message),
      changedFiles,
      sourceCommits,
    })
  }
}

export const aiService = new AIService()
