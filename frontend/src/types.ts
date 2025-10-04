/***************
 * Requisites
 ***************/

export type ReqType = "prereq" | "coreq" | "prereqPass";
export type VoteType = "up" | "down" | null;

export const ReqString: Record<ReqType, string> = {
  prereq: "Prerequisite",
  coreq: "Corequisite",
  prereqPass: "Prerequisite pass",
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

/***************
 * Users
 ***************/
export type User = {
  username: string;
  name: string;
  email: string;
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

/*******
 * API
 ********/

export type LoginResponse = {
  userId: string;
};
