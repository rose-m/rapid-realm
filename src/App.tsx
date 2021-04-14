import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { RealmAppManager } from './components/realm-app-manager';
import { RealmConfiguration } from './components/realm-configuration';
import { ProvideRealm } from './context';

function App() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Router>
        <ProvideRealm>
          <Route>
            <Switch>
              <Route exact path="/configure">
                <RealmConfiguration />
              </Route>
              <Route path="/app">
                <RealmAppManager />
              </Route>
              <Route path="*">
                <Redirect to="/app" />
              </Route>
            </Switch>
          </Route>
        </ProvideRealm>
      </Router>
    </div>
  );
}

export default App;
