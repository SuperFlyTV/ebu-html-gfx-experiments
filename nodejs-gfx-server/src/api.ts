import { z } from 'zod'

export const CommandSchemas: {
	[key: string]: {
		schema: z.ZodObject<any, any, any>
	}
} = {
	'get-list-templates': {
		schema: z.object({}),
	},
	'get-template-definition': {
		schema: z.object({
			type: z.literal(''),
			scene: z.string(),
		}),
	},
	'post-load': {
		schema: z.object({
			layer: z.string(),
			template: z.string(),
			data: z.record(z.any()).optional(),
		}),
	},

	'post-cue': {
		schema: z.object({
			layer: z.string(),
			// layer?
		}),
	},

	'post-play': {
		schema: z.object({
			layer: z.string(),
		}),
	},
	/** Take off screen */
	'post-stop': {
		schema: z.object({
			layer: z.string(),
		}),
	},
	'post-next': {
		schema: z.object({
			layer: z.string(),
		}),
	},

	'post-seek': {
		schema: z.object({
			layer: z.string(),
			position: z.string(),
			/** If true, the seek will be done with an animation */
			animate: z.boolean(),
		}),
	},
	'post-update': {
		schema: z.object({
			layer: z.string(),
			data: z.record(z.any()),
		}),
	},
	'post-invoke': {
		schema: z.object({
			layer: z.string(),
			method: z.string(),
			data: z.record(z.any()),
		}),
	},
}

// export type Command =
// 	| LoadCommand
// 	| CueCommand
// 	| PlayCommand
// 	| StopCommand
// 	| NextCommand
// 	| SeekCommand
// 	| UpdateCommand
// 	| InvokeCommand

// export type ListScenesCommand = z.infer<typeof ListScenesCommandSchema>
// export type GetDefinitionCommand = z.infer<typeof GetDefinitionCommandSchema>
// export type LoadCommand = z.infer<typeof LoadCommandSchema>
// export type CueCommand = z.infer<typeof CueCommandSchema>
// export type PlayCommand = z.infer<typeof PlayCommandSchema>
// export type StopCommand = z.infer<typeof StopCommandSchema>
// export type NextCommand = z.infer<typeof NextCommandSchema>
// export type SeekCommand = z.infer<typeof SeekCommandSchema>
// export type UpdateCommand = z.infer<typeof UpdateCommandSchema>
// export type InvokeCommand = z.infer<typeof InvokeCommandSchema>
