export interface Lead {
  id: number;
  name: string;
  phone: string;
  location: string;
  propertyType: string;
  budget: string;
  systemType: string;
  notes: string;
  status: 'new' | 'contacted' | 'closed';
  installerNotes: string;
  assignedInstallerId: number | null;
  createdAt: string;
}

export interface Installer {
  id: number;
  businessName: string;
  phone: string;
  email: string;
  location: string;
  subscriptionStatus: 'active' | 'inactive';
  createdAt: string;
}

export interface AdminStats {
  total: number;
  today: number;
  week: number;
}
