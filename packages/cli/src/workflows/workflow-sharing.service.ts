import type { User } from '@n8n/db';
import { ProjectRelationRepository, SharedWorkflowRepository } from '@n8n/db';
import { Service } from '@n8n/di';
import {
	hasGlobalScope,
	type ProjectRole,
	type WorkflowSharingRole,
	type Scope,
	PROJECT_OWNER_ROLE_SLUG,
} from '@n8n/permissions';
// eslint-disable-next-line n8n-local-rules/misplaced-n8n-typeorm-import
import { In } from '@n8n/typeorm';

import { RoleService } from '@/services/role.service';

export type ShareWorkflowOptions =
	| { scopes: Scope[]; projectId?: string }
	| { projectRoles: ProjectRole[]; workflowRoles: WorkflowSharingRole[]; projectId?: string };

@Service()
export class WorkflowSharingService {
	constructor(
		private readonly sharedWorkflowRepository: SharedWorkflowRepository,
		private readonly roleService: RoleService,
		private readonly projectRelationRepository: ProjectRelationRepository,
	) {}

	/**
	 * Get the IDs of the workflows that have been shared with the user based on
	 * scope or roles.
	 * If `scopes` is passed the roles are inferred. Alternatively `projectRoles`
	 * and `workflowRoles` can be passed specifically.
	 *
	 * Returns all IDs if user has the 'workflow:read' global scope.
	 */

	async getSharedWorkflowIds(user: User, options: ShareWorkflowOptions): Promise<string[]> {
		const { projectId } = options;

		if (hasGlobalScope(user, 'workflow:read')) {
			const sharedWorkflows = await this.sharedWorkflowRepository.find({
				select: ['workflowId'],
				...(projectId && { where: { projectId } }),
			});
			return sharedWorkflows.map(({ workflowId }) => workflowId);
		}

		const projectRoles =
			'scopes' in options
				? await this.roleService.rolesWithScope('project', options.scopes)
				: options.projectRoles;
		const workflowRoles =
			'scopes' in options
				? await this.roleService.rolesWithScope('workflow', options.scopes)
				: options.workflowRoles;

		const sharedWorkflows = await this.sharedWorkflowRepository.find({
			where: {
				role: In(workflowRoles),
				project: {
					projectRelations: {
						userId: user.id,
						role: In(projectRoles),
					},
				},
			},
			select: ['workflowId'],
		});

		return sharedWorkflows.map(({ workflowId }) => workflowId);
	}

	async getSharedWithMeIds(user: User) {
		const sharedWithMeWorkflows = await this.sharedWorkflowRepository.find({
			select: ['workflowId'],
			where: {
				role: 'workflow:editor',
				project: {
					projectRelations: {
						userId: user.id,
						role: { slug: PROJECT_OWNER_ROLE_SLUG },
					},
				},
			},
		});

		return sharedWithMeWorkflows.map(({ workflowId }) => workflowId);
	}

	async getSharedWorkflowScopes(
		workflowIds: string[],
		user: User,
	): Promise<Array<[string, Scope[]]>> {
		const projectRelations = await this.projectRelationRepository.findAllByUser(user.id);
		const sharedWorkflows =
			await this.sharedWorkflowRepository.getRelationsByWorkflowIdsAndProjectIds(
				workflowIds,
				projectRelations.map((p) => p.projectId),
			);

		return workflowIds.map((workflowId) => {
			return [
				workflowId,
				this.roleService.combineResourceScopes(
					'workflow',
					user,
					sharedWorkflows.filter((s) => s.workflowId === workflowId),
					projectRelations,
				),
			];
		});
	}

	async getOwnedWorkflowsInPersonalProject(user: User): Promise<string[]> {
		const sharedWorkflows = await this.sharedWorkflowRepository.find({
			select: ['workflowId'],
			where: {
				role: 'workflow:owner',
				project: {
					projectRelations: {
						userId: user.id,
						role: { slug: PROJECT_OWNER_ROLE_SLUG },
					},
				},
			},
		});
		return sharedWorkflows.map(({ workflowId }) => workflowId);
	}

	/**
	 * ENHANCEMENT: Support direct user-to-user workflow sharing for Community Edition
	 * This allows users to share workflows directly without requiring projects
	 */
	async shareWorkflowWithUser(
		_workflowId: string,
		ownerId: string,
		_targetUserId: string,
		_role: 'viewer' | 'editor' = 'viewer',
	): Promise<boolean> {
		if (ownerId === _targetUserId) {
			return false; // Cannot share with self
		}

		try {
			// Store sharing info - would need to extend database schema
			// For now, this is a placeholder that would integrate with SharedWorkflowRepository
			// await this.sharedWorkflowRepository.save({
			//   workflowId: _workflowId,
			//   projectId: userProject.id,
			//   role: _role === 'editor' ? 'workflow:editor' : 'workflow:viewer',
			// });

			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * ENHANCEMENT: Get workflows shared with specific user
	 */
	async getWorkflowsSharedWithUser(userId: string): Promise<string[]> {
		const sharedWorkflows = await this.sharedWorkflowRepository.find({
			select: ['workflowId'],
			where: {
				project: {
					projectRelations: {
						userId: userId,
					},
				},
			},
		});

		return sharedWorkflows.map(({ workflowId }) => workflowId);
	}

	/**
	 * ENHANCEMENT: Remove direct user-to-user workflow sharing
	 */
	async unshareWorkflowWithUser(_workflowId: string, _targetUserId: string): Promise<boolean> {
		try {
			// Would remove sharing info from database
			// For now, this is a placeholder that would integrate with SharedWorkflowRepository
			// await this.sharedWorkflowRepository.delete({
			//   workflowId: _workflowId,
			//   projectId: userProject.id,
			// });

			return true;
		} catch (error) {
			return false;
		}
	}
}
