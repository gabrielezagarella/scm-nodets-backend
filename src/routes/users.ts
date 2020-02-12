import express from "express";

import {
  getAllUsers,
  getUsersById,
  getSubjectsOfUser,
  deleteUserById,
  deleteSubjectsOfUser,
  editUserById,
  addSubjectsOfUser,
  addGradeOfUser,
  getAllGrades,
  editGradeById,
  deleteGradeById
} from "./controllers/users.controller";

import {
  isAuth,
  isAdmin,
  isCurrentUser,
  isAtLeastTeacher
} from "../middlewares/auth.middleware";

const router = express();

router.get("/", isAuth, isAdmin, getAllUsers);

router.get("/:id", isAuth, isCurrentUser, getUsersById);

router.get("/:id/subjects", isAuth, isCurrentUser, getSubjectsOfUser);

// router.get("/:id/grades", getAllGrades);

router.delete("/:id", isAuth, isAdmin, deleteUserById);

router.delete(
  "/:id/subjects/:idSubject",
  isAuth,
  isAdmin,
  deleteSubjectsOfUser
);

router.delete(
  "/:id/grades/:idGrade",
  isAuth,
  isAtLeastTeacher,
  deleteGradeById
);

router.post("/:id/subjects", addSubjectsOfUser);

router.post("/:id/grades", isAuth, isAdmin, addGradeOfUser);

router.put("/:id", isAuth, isCurrentUser, editUserById);

router.put("/:id/grades/:idGrade", editGradeById);

export default router;
