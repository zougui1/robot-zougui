export const data = {
  name: 'music',
  subCommands: {
    download: {
      options: {
        url: {
          type: String('url'),
          validations: ['must be a youtube URL'],
          required: true,
          whenDownloaded: {
            reply: {
              to: 'command-reply',
              mention: 'user',
              content: {
                reason: 'confirm track name',
                buttons: [
                  {
                    content: 'OK',
                    action: 'remove buttons'
                  },
                  {
                    content: 'rename',
                    action: {
                      openDialog: {
                        fields: ['track number', 'title', 'artists']
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        playlist: {
          type: String,
          autocomplete: {
            directoriesFrom: '/mnt/Manjaro_Data/zougui/Audio/Music/',
            ifUnknown: 'Create playlist with confirmation dialog',
          }
        }
      }
    }
  }
}
