import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { servicesApi, adminsApi, messagesApi, galleryApi, pagesApi } from '../services/api';

// ── Interfaces (mirror MySQL schema) ──────────────────────────
export interface Admin {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'super_admin' | 'editor';
  last_login: string;
  created_at: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  detailed_content: string;
  icon_or_image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  phone_number: string;
  subject: string;
  message_body: string;
  is_read: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  image_url: string;
  title: string;
  alt_text: string;
  category: string;
  uploaded_by: number;
  created_at: string;
}

export interface PageContent {
  id: number;
  page_name: string;
  title?: string | null;
  section_key: string;
  content_value: string;
  image_url?: string | null;
  video_url?: string | null;
  updated_by: number;
  updated_at: string;
}

// ── Initial Fallback Data (used when API is unreachable) ───────
const fallbackServices: Service[] = [
  { id: 1, title: 'School Map', slug: 'school-map', short_description: 'Navigate our campus.', detailed_content: '', icon_or_image_url: 'Map', is_active: true, display_order: 1, created_at: '', updated_at: '' },
  { id: 2, title: 'Parent Portal', slug: 'parent-portal', short_description: 'Access student records.', detailed_content: '', icon_or_image_url: 'Users', is_active: true, display_order: 2, created_at: '', updated_at: '' },
  { id: 3, title: 'Newsletter', slug: 'newsletter', short_description: 'Latest school news.', detailed_content: '', icon_or_image_url: 'FileText', is_active: true, display_order: 3, created_at: '', updated_at: '' },
  { id: 4, title: 'Canteen', slug: 'canteen', short_description: 'Daily menus.', detailed_content: '', icon_or_image_url: 'Coffee', is_active: true, display_order: 4, created_at: '', updated_at: '' },
];

const fallbackGallery: GalleryImage[] = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', title: 'Campus', alt_text: 'Main campus building', category: 'Campus', uploaded_by: 1, created_at: '' },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=800&q=80', title: 'Events', alt_text: 'School event', category: 'Events', uploaded_by: 1, created_at: '' },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80', title: 'Students', alt_text: 'Students studying', category: 'Students', uploaded_by: 1, created_at: '' },
];

const fallbackPages: PageContent[] = [
  { id: 1, page_name: 'home', section_key: 'hero_title', content_value: 'UNDERDALE', updated_by: 1, updated_at: '' },
  { id: 2, page_name: 'home', section_key: 'hero_subtitle', content_value: 'At Underdale High School we foster a personalised approach to learning, seeking to extend skills, dispositions, and interests by engaging students in a world class learning experience.', updated_by: 1, updated_at: '' },
  { id: 3, page_name: 'home', section_key: 'value_1_title', content_value: 'Respect', updated_by: 1, updated_at: '' },
  { id: 4, page_name: 'home', section_key: 'value_1_text', content_value: 'We value respect for ourselves, others, and our environment.', updated_by: 1, updated_at: '' },
  { id: 5, page_name: 'home', section_key: 'value_2_title', content_value: 'Resilience', updated_by: 1, updated_at: '' },
  { id: 6, page_name: 'home', section_key: 'value_2_text', content_value: 'We bounce back from challenges and keep trying.', updated_by: 1, updated_at: '' },
  { id: 7, page_name: 'home', section_key: 'value_3_title', content_value: 'Optimism', updated_by: 1, updated_at: '' },
  { id: 8, page_name: 'home', section_key: 'value_3_text', content_value: 'We look forward to the future with hope and confidence.', updated_by: 1, updated_at: '' },
];

// ── Context Definition ─────────────────────────────────────────
interface DataContextType {
  // State
  admins: Admin[];
  services: Service[];
  messages: ContactMessage[];
  galleryImages: GalleryImage[];
  pageContent: PageContent[];
  isApiConnected: boolean;
  isLoading: boolean;

  // Admin CRUD
  addAdmin: (data: Omit<Admin, 'id' | 'created_at' | 'last_login'>) => Promise<void>;
  updateAdmin: (id: number, data: Partial<Admin>) => Promise<void>;
  deleteAdmin: (id: number) => Promise<void>;

  // Service CRUD
  addService: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (id: number, data: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;

  // Message CRUD
  addMessage: (data: Omit<ContactMessage, 'id' | 'created_at'>) => Promise<void>;
  updateMessage: (id: number, data: Partial<ContactMessage>) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;

  // Gallery CRUD
  addGalleryImage: (data: Omit<GalleryImage, 'id' | 'created_at'>) => Promise<void>;
  updateGalleryImage: (id: number, data: Partial<GalleryImage>) => Promise<void>;
  deleteGalleryImage: (id: number) => Promise<void>;

  // Page Content CRUD
  addPageContent: (data: Omit<PageContent, 'id' | 'updated_at'>) => Promise<void>;
  updatePageContent: (id: number, data: Partial<PageContent>) => Promise<void>;
  deletePageContent: (id: number) => Promise<void>;

  // Refresh from API
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ── Helper: localStorage key-value cache ───────────────────────
const LS_KEY = 'uhs_data_cache';
const saveCache = (data: Partial<{services: Service[], gallery: GalleryImage[], pages: PageContent[], admins: Admin[], messages: ContactMessage[]}>) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ ...getCache(), ...data, _ts: Date.now() })); } catch {}
};
const getCache = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
};

// ── Provider ───────────────────────────────────────────────────
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const cache = getCache();

  const [admins, setAdmins] = useState<Admin[]>(cache.admins || []);
  const [services, setServices] = useState<Service[]>(cache.services || fallbackServices);
  const [messages, setMessages] = useState<ContactMessage[]>(cache.messages || []);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(cache.gallery || fallbackGallery);
  const [pageContent, setPageContent] = useState<PageContent[]>(cache.pages || fallbackPages);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load all data from API ──────────────────────────────────
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Public endpoints – always fetch
      const [s, g, p] = await Promise.all([
        servicesApi.getAll(true),
        galleryApi.getAll(),
        pagesApi.getAll(),
      ]);
      setServices(s);
      setGalleryImages(g);
      setPageContent(p);
      setIsApiConnected(true);
      saveCache({ services: s, gallery: g, pages: p });

      // Protected endpoints – only fetch when logged in
      const token = localStorage.getItem('uhs_admin_token');
      if (token) {
        try {
          const [a, m] = await Promise.all([
            adminsApi.getAll(),
            messagesApi.getAll(),
          ]);
          setAdmins(a);
          setMessages(m);
          saveCache({ admins: a, messages: m });
        } catch {
          // Token may be expired – protected data stays cached
          console.warn('Protected endpoints returned an error. Token may be expired.');
        }
      }
    } catch {
      // API not reachable – use cache or fallback, but warn
      console.warn('Backend API not reachable. Using cached/fallback data.');
      setIsApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Generic helpers ─────────────────────────────────────────
  const nextId = (arr: { id: number }[]) => Math.max(0, ...arr.map(x => x.id)) + 1;
  const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

  // ── CRUD: Admins ────────────────────────────────────────────
  const addAdmin = async (data: Omit<Admin, 'id' | 'created_at' | 'last_login'>) => {
    if (isApiConnected) {
      const created = await adminsApi.create(data);
      setAdmins(prev => { const next = [...prev, created]; saveCache({ admins: next }); return next; });
    } else {
      setAdmins(prev => { const next = [...prev, { ...data, id: nextId(prev), created_at: now(), last_login: '' }]; saveCache({ admins: next }); return next; });
    }
  };
  const updateAdmin = async (id: number, data: Partial<Admin>) => {
    if (isApiConnected) {
      const updated = await adminsApi.update(id, data);
      setAdmins(prev => { const next = prev.map(a => a.id === id ? updated : a); saveCache({ admins: next }); return next; });
    } else {
      setAdmins(prev => { const next = prev.map(a => a.id === id ? { ...a, ...data } : a); saveCache({ admins: next }); return next; });
    }
  };
  const deleteAdmin = async (id: number) => {
    if (isApiConnected) await adminsApi.delete(id);
    setAdmins(prev => { const next = prev.filter(a => a.id !== id); saveCache({ admins: next }); return next; });
  };

  // ── CRUD: Services ──────────────────────────────────────────
  const addService = async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    if (isApiConnected) {
      const created = await servicesApi.create(data);
      setServices(prev => { const next = [...prev, created]; saveCache({ services: next }); return next; });
    } else {
      setServices(prev => { const next = [...prev, { ...data, id: nextId(prev), created_at: now(), updated_at: now() }]; saveCache({ services: next }); return next; });
    }
  };
  const updateService = async (id: number, data: Partial<Service>) => {
    if (isApiConnected) {
      const updated = await servicesApi.update(id, data);
      setServices(prev => { const next = prev.map(s => s.id === id ? updated : s); saveCache({ services: next }); return next; });
    } else {
      setServices(prev => { const next = prev.map(s => s.id === id ? { ...s, ...data, updated_at: now() } : s); saveCache({ services: next }); return next; });
    }
  };
  const deleteService = async (id: number) => {
    if (isApiConnected) await servicesApi.delete(id);
    setServices(prev => { const next = prev.filter(s => s.id !== id); saveCache({ services: next }); return next; });
  };

  // ── CRUD: Messages ──────────────────────────────────────────
  const addMessage = async (data: Omit<ContactMessage, 'id' | 'created_at'>) => {
    if (isApiConnected) {
      const created = await messagesApi.create(data);
      setMessages(prev => { const next = [created, ...prev]; saveCache({ messages: next }); return next; });
    } else {
      setMessages(prev => { const next = [{ ...data, id: nextId(prev), created_at: now() }, ...prev]; saveCache({ messages: next }); return next; });
    }
  };
  const updateMessage = async (id: number, data: Partial<ContactMessage>) => {
    if (isApiConnected) {
      const updated = await messagesApi.update(id, data);
      setMessages(prev => { const next = prev.map(m => m.id === id ? updated : m); saveCache({ messages: next }); return next; });
    } else {
      setMessages(prev => { const next = prev.map(m => m.id === id ? { ...m, ...data } : m); saveCache({ messages: next }); return next; });
    }
  };
  const deleteMessage = async (id: number) => {
    if (isApiConnected) await messagesApi.delete(id);
    setMessages(prev => { const next = prev.filter(m => m.id !== id); saveCache({ messages: next }); return next; });
  };

  // ── CRUD: Gallery ───────────────────────────────────────────
  const addGalleryImage = async (data: Omit<GalleryImage, 'id' | 'created_at'>) => {
    if (isApiConnected) {
      const created = await galleryApi.create(data);
      setGalleryImages(prev => { const next = [created, ...prev]; saveCache({ gallery: next }); return next; });
    } else {
      setGalleryImages(prev => { const next = [...prev, { ...data, id: nextId(prev), created_at: now() }]; saveCache({ gallery: next }); return next; });
    }
  };
  const updateGalleryImage = async (id: number, data: Partial<GalleryImage>) => {
    if (isApiConnected) {
      const updated = await galleryApi.update(id, data);
      setGalleryImages(prev => { const next = prev.map(g => g.id === id ? updated : g); saveCache({ gallery: next }); return next; });
    } else {
      setGalleryImages(prev => { const next = prev.map(g => g.id === id ? { ...g, ...data } : g); saveCache({ gallery: next }); return next; });
    }
  };
  const deleteGalleryImage = async (id: number) => {
    if (isApiConnected) await galleryApi.delete(id);
    setGalleryImages(prev => { const next = prev.filter(g => g.id !== id); saveCache({ gallery: next }); return next; });
  };

  // ── CRUD: Page Content ──────────────────────────────────────
  const addPageContent = async (data: Omit<PageContent, 'id' | 'updated_at'>) => {
    if (isApiConnected) {
      const created = await pagesApi.create(data);
      setPageContent(prev => { const next = [...prev, created]; saveCache({ pages: next }); return next; });
    } else {
      setPageContent(prev => { const next = [...prev, { ...data, id: nextId(prev), updated_at: now() }]; saveCache({ pages: next }); return next; });
    }
  };
  const updatePageContent = async (id: number, data: Partial<PageContent>) => {
    if (isApiConnected) {
      const updated = await pagesApi.update(id, data);
      setPageContent(prev => { const next = prev.map(p => p.id === id ? updated : p); saveCache({ pages: next }); return next; });
    } else {
      setPageContent(prev => { const next = prev.map(p => p.id === id ? { ...p, ...data, updated_at: now() } : p); saveCache({ pages: next }); return next; });
    }
  };
  const deletePageContent = async (id: number) => {
    if (isApiConnected) await pagesApi.delete(id);
    setPageContent(prev => { const next = prev.filter(p => p.id !== id); saveCache({ pages: next }); return next; });
  };

  return (
    <DataContext.Provider value={{
      admins, services, messages, galleryImages, pageContent, isApiConnected, isLoading,
      addAdmin, updateAdmin, deleteAdmin,
      addService, updateService, deleteService,
      addMessage, updateMessage, deleteMessage,
      addGalleryImage, updateGalleryImage, deleteGalleryImage,
      addPageContent, updatePageContent, deletePageContent,
      refresh,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
