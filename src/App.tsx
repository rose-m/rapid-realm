import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ProvideRealm } from './context';
import { RealmAppManager } from './components/realm-app-manager';
import { RealmConfiguration } from './components/realm-configuration';

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
              <RealmConfiguration />
            </Route>
          </Switch>
        </Router>
      </ProvideRealm>
    </div>
  );
}

export default App;
