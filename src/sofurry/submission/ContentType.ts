export enum ContentType {
  Story = '0',
  Art = '1',
  Music = '2',
  Journal = '3',
  Photo = '4',
}

export const ReverseContentType = {
  '0': 'Story',
  '1': 'Art',
  '2': 'Music',
  '3': 'Journal',
  '4': 'Photo',
} as const;
