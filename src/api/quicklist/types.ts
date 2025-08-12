// QuickList-related types
export interface QuickList {
  id: string;
  name: string;
  users: QuickListFriend[];
  icon?: string;
}

export interface QuickListFriend {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  addedAt: string;
}


export interface UpdateQuickListRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isDefault?: boolean;
}

export interface QuickListStats {
  totalLists: number;
  totalFriendsInLists: number;
  mostUsedList: QuickList;
  averageFriendsPerList: number;
}
