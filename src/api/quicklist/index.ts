// Re-export all quicklist-related API components
export * from './types';
export * from './queries';
export * from './mutations';

// Convenience exports for your Django backend
export { 
  GET_MY_QUICK_LISTS, // This matches your Django resolver: resolve_my_quick_lists
} from './queries';

export { 
  DELETE_QUICK_LIST
} from './mutations';

export type { 
  QuickList, 
  QuickListFriend, 
  UpdateQuickListRequest, 
} from './types';
