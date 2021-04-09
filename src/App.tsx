import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ProvideRealm } from './context';
import { RealmAppManager } from './realm-app-manager';

function App() {
  return (
    <div style={{ background: '' }}>
      <ProvideRealm>
        <Router>
          <Switch>
            <Route path="/realm">
              <RealmAppManager />
            </Route>
            <Route path="*">
              <h1>Hey hey</h1>
            </Route>
          </Switch>
        </Router>
      </ProvideRealm>
    </div>
  );
}

export default App;
