import type {
  HomePageDto,
  HomeProjectsSectionDto,
  PagedResult,
  ArticleSummaryDto,
  ArticleDetailDto,
  TokenResponseDto,
  LoginRequestDto,
  ArticleCommentDto,
  OrgStructurePageDto,
  ProjectsHubPageDto,
  ProjectPublicDetailDto,
  JoinMovementRequestDto,
  MemberProfileDto,
  UpdateMemberProfileDto,
} from "@/types/api";
import { SITE_LOGO_PATH } from "@/lib/siteImage";

/** API origin; can be overridden by `VITE_API_BASE_URL`. */
const BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://syriasonsmovement-production.up.railway.app";
const API = `${BASE}/api/client/v1`;

function authHeaders(): Record<string, string> {
  const token = sessionStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { ...authHeaders(), ...(options?.headers as Record<string, string> | undefined) };
  const hasJsonBody = typeof options?.body === "string";
  if (hasJsonBody) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string; title?: string };
    const msg = body.message || body.title;
    throw new Error(msg || `فشل الطلب (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getHome: () => request<HomePageDto>(`${API}/home`),

  /** Same listing as home `articlesSection`; use for strip pagination without refetching full home. */
  getHomeArticlesPage: (page = 1, pageSize = 10, categoryId?: string, search?: string) => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("pageSize", String(pageSize));
    if (categoryId) sp.set("categoryId", categoryId);
    if (search?.trim()) sp.set("search", search.trim());
    return request<PagedResult<ArticleSummaryDto>>(`${API}/home/articles?${sp}`);
  },

  /** Returns `null` when projects hub is hidden (HTTP 404). */
  getHomeProjectsPage: async (page = 1, pageSize = 6): Promise<HomeProjectsSectionDto | null> => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("pageSize", String(pageSize));
    const headers: Record<string, string> = { ...authHeaders() };
    const res = await fetch(`${API}/home/projects?${sp}`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string; title?: string };
      const msg = body.message || body.title;
      throw new Error(msg || `فشل الطلب (${res.status})`);
    }
    return res.json() as Promise<HomeProjectsSectionDto>;
  },

  /** Returns `null` when the page is hidden or missing (HTTP 404). */
  getProjectsHub: async (params?: {
    page?: number;
    pageSize?: number;
    /** 1–3 = filter by project section; omit for all. */
    section?: number | null;
    search?: string;
  }): Promise<ProjectsHubPageDto | null> => {
    const sp = new URLSearchParams();
    if (params?.page != null) sp.set("page", String(params.page));
    if (params?.pageSize != null) sp.set("pageSize", String(params.pageSize));
    if (params?.section != null && params.section >= 1 && params.section <= 3) {
      sp.set("section", String(params.section));
    }
    if (params?.search?.trim()) sp.set("search", params.search.trim());
    const q = sp.toString();
    const headers: Record<string, string> = { ...authHeaders() };
    const res = await fetch(`${API}/projects${q ? `?${q}` : ""}`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string; title?: string };
      const msg = body.message || body.title;
      throw new Error(msg || `فشل الطلب (${res.status})`);
    }
    return res.json() as Promise<ProjectsHubPageDto>;
  },

  getProject: (slug: string) => request<ProjectPublicDetailDto>(`${API}/projects/${encodeURIComponent(slug)}`),

  getOrganizationPage: async (): Promise<OrgStructurePageDto | null> => {
    const headers: Record<string, string> = { ...authHeaders() };
    const res = await fetch(`${API}/organization`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string; title?: string };
      const msg = body.message || body.title;
      throw new Error(msg || `فشل الطلب (${res.status})`);
    }
    return res.json() as Promise<OrgStructurePageDto>;
  },

  getArticles: (params: { page?: number; pageSize?: number; categoryId?: string; search?: string }) => {
    const sp = new URLSearchParams();
    if (params.page) sp.set("page", String(params.page));
    if (params.pageSize) sp.set("pageSize", String(params.pageSize));
    if (params.categoryId) sp.set("categoryId", params.categoryId);
    if (params.search?.trim()) sp.set("search", params.search.trim());
    return request<PagedResult<ArticleSummaryDto>>(`${API}/articles?${sp}`);
  },

  getArticle: (slug: string, params?: { commentsPage?: number; commentsPageSize?: number }) => {
    const sp = new URLSearchParams();
    if (params?.commentsPage != null) sp.set("commentsPage", String(params.commentsPage));
    if (params?.commentsPageSize != null) sp.set("commentsPageSize", String(params.commentsPageSize));
    const q = sp.toString();
    return request<ArticleDetailDto>(`${API}/articles/${slug}${q ? `?${q}` : ""}`);
  },

  loginClient: (payload: LoginRequestDto) =>
    request<TokenResponseDto>(`${API}/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  submitJoinRequest: (payload: JoinMovementRequestDto) =>
    request<void>(`${API}/auth/join-request`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getProfile: () => request<MemberProfileDto>(`${API}/auth/profile`),

  updateProfile: (payload: UpdateMemberProfileDto) =>
    request<MemberProfileDto>(`${API}/auth/profile`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  likeArticle: (id: string) =>
    request<void>(`${API}/articles/${id}/like`, { method: "POST" }),

  unlikeArticle: (id: string) =>
    request<void>(`${API}/articles/${id}/like`, { method: "DELETE" }),

  addComment: (articleId: string, body: string, parentCommentId?: string | null) =>
    request<ArticleCommentDto>(`${API}/articles/${articleId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body, parentCommentId: parentCommentId ?? null }),
    }),

  deleteComment: (articleId: string, commentId: string) =>
    request<void>(`${API}/articles/${articleId}/comments/${commentId}`, {
      method: "DELETE",
    }),
};

export function getImageUrl(path: string | null | undefined): string {
  if (!path?.trim()) return SITE_LOGO_PATH;
  const p = path.trim();
  if (p.startsWith("http")) return p;
  return `${BASE}${p}`;
}
