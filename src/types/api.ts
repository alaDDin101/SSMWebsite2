export interface SliderSlideDto {
  id: string;
  backgroundImageUrl: string | null;
  title: string | null;
  subtitle: string | null;
  contentHtml: string | null;
  linkTargetType: 0 | 1 | 2;
  articleId: string | null;
  articleTitle: string | null;
  articleSlug: string | null;
  externalUrl: string | null;
  openInNewTab: boolean;
  displayOrder: number;
  isActive: boolean;
  titleColor?: string | null;
  subtitleTextColor?: string | null;
  subtitleBadgeBackgroundColor?: string | null;
  subtitleBadgeBorderColor?: string | null;
  contentHtmlColor?: string | null;
  ctaBackgroundColor?: string | null;
  ctaTextColor?: string | null;
  navArrowBackgroundColor?: string | null;
  navArrowIconColor?: string | null;
  dotActiveColor?: string | null;
  dotInactiveColor?: string | null;
  overlayBottomColor?: string | null;
  overlayMiddleColor?: string | null;
  overlayTopColor?: string | null;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  backgroundImageUrl: string | null;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ArticleSummaryDto {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  categoryId: string;
  categoryName: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface SocialLinkDto {
  id: string;
  platformKey: string;
  label: string;
  url: string;
  iconUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

/** Public “About us” block on the home page (only when enabled in dashboard). */
export interface AboutUsPublicDto {
  title: string;
  leadText: string | null;
  bodyHtml: string;
  imageUrl: string | null;
  sectionBackgroundColor: string | null;
  cardBackgroundColor: string | null;
  accentColor: string | null;
  headingTextColor: string | null;
  bodyTextColor: string | null;
  mutedTextColor: string | null;
}

export interface HomeProjectSlideDto {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  coverImageUrl: string | null;
  sectionTitle: string;
  publishedAt: string | null;
}

export interface HomeProjectsSectionDto {
  title: string;
  leadText: string | null;
  page: number;
  pageSize: number;
  totalCount: number;
  items: HomeProjectSlideDto[];
}

export interface HomePageDto {
  slides: SliderSlideDto[];
  categories: CategoryDto[];
  /** First page of articles for the home strip; use `items` for the list. */
  articlesSection: PagedResult<ArticleSummaryDto>;
  socialLinks: SocialLinkDto[];
  aboutUs?: AboutUsPublicDto | null;
  projectsSection?: HomeProjectsSectionDto | null;
}

/** Public organizational structure page (only when enabled in dashboard). */
export interface OrgStructurePositionPublicDto {
  id: string;
  title: string;
  holderName: string | null;
}

export interface OrgStructureCommitteePublicDto {
  id: string;
  name: string;
  description: string | null;
  positions: OrgStructurePositionPublicDto[];
}

export interface OrgStructurePageDto {
  title: string;
  leadText: string | null;
  introHtml: string | null;
  committees: OrgStructureCommitteePublicDto[];
  rootPositions: OrgStructurePositionPublicDto[];
}

export interface ProjectHubCardDto {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  /** 1–3, matches API `ProjectSection`. */
  section: number;
  sectionTitle: string;
}

export interface ProjectsHubPageDto {
  title: string;
  leadText: string | null;
  introHtml: string | null;
  page: number;
  pageSize: number;
  totalCount: number;
  /** Set when `section` query was sent (1–3). */
  sectionFilter: number | null;
  items: ProjectHubCardDto[];
}

export interface ProjectPublicDetailDto {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  bodyHtml: string;
  coverImageUrl: string | null;
  section: number;
  sectionTitle: string;
  isPublished: boolean;
  publishedAt: string | null;
  viewCount: number;
  authorDisplayName: string | null;
}

export interface ArticleCommentDto {
  id: string;
  body: string;
  createdAt: string;
  userId: string;
  userDisplayName: string;
  parentCommentId: string | null;
  isApproved: boolean;
  replies: ArticleCommentDto[];
}

export interface ArticleDetailDto {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  bodyHtml: string;
  coverImageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  viewCount: number;
  likeCount: number;
  categoryId: string;
  categoryName: string;
  authorDisplayName: string | null;
  likedByCurrentUser: boolean;
  comments: PagedResult<ArticleCommentDto>;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface TokenResponseDto {
  accessToken: string;
  expiresAt: string;
  userId: string;
  email?: string | null;
  roles?: string[];
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface JoinMovementRequestDto {
  firstName: string;
  fatherName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  city: string;
  email: string;
  phoneNumber: string;
  password: string;
  address?: string | null;
  preferredContactMethod: string;
  educationLevel: string;
  specialization: string;
  currentProfession: string;
  employer?: string | null;
  joinReason: string;
  previouslyAffiliated: boolean;
  previousAffiliationDetails?: string | null;
  participationAreas: string;
  focusIssues: string;
  skills: string;
  previousExperiences?: string | null;
  languages: string;
  weeklyVolunteerHours: string;
  fieldWorkReady: boolean;
  mobilityTravelAbility: string;
  commitToPrinciples: boolean;
  infoIsAccurate: boolean;
  acceptPrivacyPolicy: boolean;
}

export interface MemberProfileDto {
  firstName: string;
  fatherName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  city: string;
  email: string;
  phoneNumber: string;
  address?: string | null;
  preferredContactMethod: string;
  educationLevel: string;
  specialization: string;
  currentProfession: string;
  employer?: string | null;
  joinReason: string;
  previouslyAffiliated: boolean;
  previousAffiliationDetails?: string | null;
  participationAreas: string;
  focusIssues: string;
  skills: string;
  previousExperiences?: string | null;
  languages: string;
  weeklyVolunteerHours: string;
  fieldWorkReady: boolean;
  mobilityTravelAbility: string;
  commitToPrinciples: boolean;
  infoIsAccurate: boolean;
  acceptPrivacyPolicy: boolean;
  joinStatus: string;
}

export type UpdateMemberProfileDto = Omit<MemberProfileDto, "joinStatus">;
