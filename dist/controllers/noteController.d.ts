import { Request, Response } from 'express';
export declare const createNote: (req: Request, res: Response) => Promise<Response>;
export declare const updateNote: (req: Request, res: Response) => Promise<Response>;
export declare const deleteNote: (req: Request, res: Response) => Promise<Response>;
export declare const getActiveNotes: (req: Request, res: Response) => Promise<Response>;
export declare const getArchivedNotes: (req: Request, res: Response) => Promise<Response>;
export declare const getNoteById: (req: Request, res: Response) => Promise<Response>;
export declare const toggleArchiveNote: (req: Request, res: Response) => Promise<Response>;
//# sourceMappingURL=noteController.d.ts.map