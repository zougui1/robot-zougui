import { StoryService } from '../../story.service';
import { Option } from '../../../../discord';


export const storyNameOption = new Option('<story-name>')
  .description('Name of the story')
  .autocomplete(async ({ value }) => {
    const service = new StoryService();
    const storyNames = await service.findMatchingStoryNames({ name: value });

    return storyNames;
  });
