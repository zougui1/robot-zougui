import { downloadFile } from './utils';
import { CreateChapterService } from '../create-chapter/create-chapter.service';
import env from '../../../env';

export class CreatePrivateChapterService {
  readonly #createChapter: CreateChapterService = new CreateChapterService();

  createChapter = async (options: CreateChapterOptions): Promise<CreateChapterResult> => {
    const { filePath, wordCount } = await downloadFile(options.fileUrl, env.tempDir, options.fileName, {
      onProgress: state => options.onProgress(state.progressString),
    });

    return await this.#createChapter.createChapter({
      ...options,
      filePath,
      wordCount,
    });
  }
}

export interface CreateChapterOptions {
  storyName: string;
  fileUrl: string;
  fileName: string;
  onProgress: (progress: string) => void;
  chapterName?: string | undefined;
  index?: number | undefined;
  startRead?: boolean | undefined;
  startFap?: boolean | undefined;
}

export interface CreateChapterResult {
  message: string;
}
