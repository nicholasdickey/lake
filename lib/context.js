// ./lib/context.js
import { createContext, useContext } from 'react';

const AppContext = createContext();

export function AppWrapper({ children, session, qparams, channelDetails,newsline,setLoading,installPrompt }) {
  const newslineSingleSelectors = [{
    qType: 'mix',
    tag: 'news&views'
  },
  {
    qType: 'newsline',
    tag: 'newsline'
  },
  {
    qType: 'reacts',
    tag: 'comments'
  },
  {
    qType: 'topics',
    tag: 'active topics'
  },
  {
    qType: 'navigator',
    tag: 'navigator'
  }
]
  const topicSingleSelectors = [{
    qType: 'topic',
    tag: 'topic'
  },
  {
    qType: 'tag',
    tag: 'publication feed'
  }]


  let sharedState = { session, qparams, channelDetails,newsline,newslineSingleSelectors,topicSingleSelectors,setLoading,installPrompt }

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}