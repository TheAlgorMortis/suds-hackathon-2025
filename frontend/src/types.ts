/***************
 * Requisites
 ***************/

export type ReqType = "prereq" | "coreq" | "prereqPass";
export type VoteType = "up" | "down" | null;
export type ModuleStatus =
  | "notRegistered"
  | "inProgress"
  | "failed"
  | "passed"
  | "distinction";

export const ReqString: Record<ReqType, string> = {
  prereq: "Prerequisite",
  coreq: "Corequisite",
  prereqPass: "Prerequisite pass",
};

export const StatusString: Record<ModuleStatus, string> = {
  notRegistered: "Unregistered",
  inProgress: "Module in progress",
  failed: "Failed",
  passed: "Passed",
  distinction: "Passed with distinction",
};

export type Req = {
  moduleId: string;
  code: string;
  type: ReqType;
};

/***************
 * Modules
 ***************/

export type ModulePreview = {
  moduleId: string;
  code: string;
  name: string;
  rating: Number;
};

export type Module = {
  moduleId: string;
  code: string;
  name: string;
  rating: Number;
  description: string;
  lectureHours: Number;
  tutHours: Number;
  reqs: Req[];
};

export type ModuleInfo = {
  code: string;
  name: string;
  status?: ModuleStatus;
};

export type UserReview = {
  code: string;
  name: string;
  rating?: numner;
};

/***************
 * Users
 ***************/

export type User = {
  username: string;
  name: string;
  email: string;
  totalVotes: number;
  takingModules: ModuleInfo[];
  tutoringModules: ModuleInfo[];
  reviews: UserReview[];
};

/**********
 * Review
 *********/
export type Review = {
  reviewId: string;
  username: string;
  title: string;
  text: string;
  rating: Number;
  date: Date;
  votes: Number;
  userVote: VoteType;
};

/************
 * Tutor List
 ************/
export type Tutor = {
  username: string;
  name: string;
  email: string;
  description: string;
  hourlyRate: Number;
};

/*******
 * API
 ********/

export type LoginResponse = {
  userId: string;
};
