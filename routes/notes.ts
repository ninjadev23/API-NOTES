import { Router } from "express";
import { NoteModel } from "../models/Notes";
import { NoteSchema, Note, HttpError, queryFilter } from "../types";
import { handleError, verifySession } from "../utils";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const userSession = verifySession(req.cookies.access_token);
    const title = req.query.title;
    const filter: queryFilter = {
      userID: userSession.userID,
    };
    if (typeof title === "string" && title.trim() !== "") {
      filter.title = { $regex: title, $options: "i" };
    }
    const Notes: Note[] | null = await NoteModel.find(filter);
    res.status(200).json(Notes);
  } catch (err) {
    handleError(res, err as Error);
  }
});

router.post("/", async (req, res) => {
  try {
    const userSession = verifySession(req.cookies.access_token);
    const NoteValided = NoteSchema.parse(req.body);
    const newNote = new NoteModel({
      userID: userSession.userID,
      ...NoteValided,
    });
    const NoteSaved = await newNote.save();
    res.json(NoteSaved);
  } catch (err) {
    handleError(res, err as Error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const NoteID = req.params.id;
    if (typeof NoteID !== "string") throw new Error("Id incorrect");
    const userSession = verifySession(req.cookies.access_token);
    const Note = await NoteModel.findOneAndDelete({
      userID: userSession.userID,
      _id: NoteID,
    });
    if (Note === null) throw new HttpError("Note not found", 404);
    else res.json({ message: "Deleted" });
  } catch (err) {
    handleError(res, err as Error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const NoteID = req.params.id;
    if (typeof NoteID !== "string") throw new Error("Id incorrect");
    const userSession = verifySession(req.cookies.access_token);
    const NoteValided = NoteSchema.parse(req.body);
    const Note: Note | null = await NoteModel.findOneAndUpdate(
      {
        userID: userSession.userID,
        _id: NoteID,
      },
      NoteValided,
      {
        new: true,
      }
    );
    res.json(Note);
  } catch (err) {
    handleError(res, err as Error);
  }
});

router.get("/tags", async (req, res) => {
  try {
    const userSession = verifySession(req.cookies.access_token);
    let tags = req.query.tags;
    if (!tags) throw new Error("Tags are required");
    if (typeof tags !== "string") throw new Error("Tags must be a string");
    tags = tags.split(",");
    const Notes: Note[] = await NoteModel.find({
      userID: userSession.userID,
      tags: { $in: tags },
    });
    res.json(Notes);
  } catch (err) {
    handleError(res, err as Error);
  }
});

router.get("/get-tags", async (req, res) => {
  try {
    const userSession = verifySession(req.cookies.access_token);
    const Notes: Note[] | null = await NoteModel.find({
      userID: userSession.userID,
    });
    const tags: string[] = Array.from(
      new Set(Notes.map((note) => note.tags || []).flat()) //Aca uso un set para no mostrar tags repetidos
    );
    res.json(tags);
  } catch (err) {
    handleError(res, err as Error);
  }
});
//Esta ruta va de ultimo para no tener conflicto con otras,
//la jerarquia va por el orden de declaracion
router.get("/:id", async (req, res) => {
  try {
    const userSession = verifySession(req.cookies.access_token);
    const NoteID = req.params.id;
    if (typeof NoteID !== "string") throw new Error("Id incorrect");
    const Note: Note | null = await NoteModel.findOne({
      userID: userSession.userID,
      _id: NoteID,
    });
    if (Note === null) res.status(404).send("404 Not Found");
    else res.status(200).json(Note);
  } catch (err) {
    handleError(res, err as Error);
  }
});
export default router;
