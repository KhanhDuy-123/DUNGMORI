import AppProvider from 'states/context/providers/AppProvider';

const AppAction = {
  onUpdateTotalKaiwaUnread: (totalKaiwaUnread) => {
    AppProvider.instance.setState({ totalKaiwaUnread });
  },
  onReplyComment: (replyComment) => {
    AppProvider.instance.setState({ replyComment });
  },
  onAddComment: (comment) => {
    AppProvider.instance.setState({ addComment: comment });
  },
  onDeleteComment: (comment) => {
    AppProvider.instance.setState({ deleteComment: comment });
  },
  onUpdateComment: (comment) => {
    AppProvider.instance.setState({ updateComment: comment });
  },
  onSaveParentId: (parentComment) => {
    AppProvider.instance.setState({ parentComment });
  },
  onGetConnectInternet: (internet) => {
    AppProvider.instance.setState({ internet });
  },
  onSaveVideoDownload: (videoOffline) => {
    AppProvider.instance.setState({ videoOffline });
  }
};

export default AppAction;
