import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import LiveStreamScreen from './screens/LiveStreamScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import NotificationScreen from './screens/NotificationScreen';
import PaymentScreen from './screens/PaymentScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import TestimonialScreen from './screens/TestimonialScreen';
import VideoScreen from './screens/VideoScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/auth" component={AuthScreen} />
        <Route path="/home" component={HomeScreen} />
        <Route path="/live" component={LiveStreamScreen} />
        <Route path="/marketplace" component={MarketplaceScreen} />
        <Route path="/notifications" component={NotificationScreen} />
        <Route path="/payments" component={PaymentScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/settings" component={SettingsScreen} />
        <Route path="/testimonials" component={TestimonialScreen} />
        <Route path="/videos/:id" component={VideoScreen} />
        <Route exact path="/" component={HomeScreen} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;