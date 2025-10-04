/***************
 * Requisites
 ***************/

export type ReqType = "prereq" | "coreq" | "prereqPass";

export const ReqString: Record<ReqType, string> = {
  prereq: "Prerequisite",
  coreq: "Corequisite",
  prereqPass: "Prerequisite pass",
};

export type Req = {
  moduleId: string;
  code: string;
  type: reqType;
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
