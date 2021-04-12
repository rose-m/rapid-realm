import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { RealmAppManager } from './components/realm-app-manager';
import { RealmConfiguration } from './components/realm-configuration';
import { ProvideRealm } from './context';

function App() {
  return (
    <div style={{ background: '' }}>
      <Router>
        <ProvideRealm>
          <Route>
            <Switch>
              <Route path="/configure">
                <RealmConfiguration />
              </Route>
              <Route path="*">
                <RealmAppManager />
              </Route>
            </Switch>
          </Route>
        </ProvideRealm>
      </Router>
    </div>
  );
}

export default App;
