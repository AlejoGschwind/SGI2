import { combineReducers } from 'redux';

import userReducer from './user/user.reducer';
import flashmessageReducer from './flashmessage/flashmessage.reducer';
import eventReducer from './event/event.reducer';

export default combineReducers({
  user: userReducer,
  flashmessages: flashmessageReducer,
  events: eventReducer
});