
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import NewApplicationWizard from './components/NewApplicationWizard';
import ApplicationList from './components/ApplicationList';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Settings from './components/Settings';
import ApplicationDetails from './components/ApplicationDetails';
import DocumentLibrary from './components/DocumentLibrary';
import { ScholarshipApplication, Document, DocStatus, UserSettings, ApplicationStatus } from './types';

const ApplicationDetailsWrapper = ({ 
  applications, 
  onUpdate, 
  settings 
}: { 
  applications: ScholarshipApplication[], 
  onUpdate: (app: ScholarshipApplication) => void,
  settings: UserSettings
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = applications.find(a => a.id === id);

  if (!app) return <Navigate to="/applications" />;

  return (
    <ApplicationDetails 
      application={app} 
      onBack={() => navigate('/applications')} 
      onUpdateApplication={onUpdate}
      settings={settings}
    />
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_auth') === 'true';
  });
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('user_name'));
  const [showLogin, setShowLogin] = useState(false);

  // User-specific storage keys
  const getStorageKey = (key: string) => user ? `${user.toLowerCase()}_${key}` : null;

  const [settings, setSettings] = useState<UserSettings>(() => {
    const storedUser = localStorage.getItem('user_name');
    const saved = storedUser ? localStorage.getItem(`${storedUser.toLowerCase()}_scholar_settings`) : null;
    return saved ? JSON.parse(saved) : { useLocalStorage: true };
  });

  const [applications, setApplications] = useState<ScholarshipApplication[]>(() => {
    const storedUser = localStorage.getItem('user_name');
    const saved = storedUser ? localStorage.getItem(`${storedUser.toLowerCase()}_scholar_apps`) : null;
    return saved ? JSON.parse(saved) : [];
  });

  const [reusableDocs, setReusableDocs] = useState<Document[]>(() => {
    const storedUser = localStorage.getItem('user_name');
    const saved = storedUser ? localStorage.getItem(`${storedUser.toLowerCase()}_reusable_docs`) : null;
    return saved ? JSON.parse(saved) : [
      { id: 'r1', name: 'International Passport', isReusable: true, status: DocStatus.PENDING },
      { id: 'r2', name: 'Academic Transcripts', isReusable: true, status: DocStatus.PENDING },
    ];
  });

  // Load user-specific data
  useEffect(() => {
    if (user) {
      const u = user.toLowerCase();
      const savedApps = localStorage.getItem(`${u}_scholar_apps`);
      const savedDocs = localStorage.getItem(`${u}_reusable_docs`);
      const savedSets = localStorage.getItem(`${u}_scholar_settings`);

      if (savedApps) setApplications(JSON.parse(savedApps));
      else setApplications([]);

      if (savedDocs) setReusableDocs(JSON.parse(savedDocs));
      else setReusableDocs([
        { id: 'r1', name: 'International Passport', isReusable: true, status: DocStatus.PENDING },
        { id: 'r2', name: 'Academic Transcripts', isReusable: true, status: DocStatus.PENDING },
      ]);

      if (savedSets) setSettings(JSON.parse(savedSets));
      else setSettings({ useLocalStorage: true });
    }
  }, [user]);

  // Persist current user data
  useEffect(() => {
    const key = getStorageKey('scholar_apps');
    if (key) localStorage.setItem(key, JSON.stringify(applications));
  }, [applications, user]);

  useEffect(() => {
    const key = getStorageKey('reusable_docs');
    if (key) localStorage.setItem(key, JSON.stringify(reusableDocs));
  }, [reusableDocs, user]);

  useEffect(() => {
    const key = getStorageKey('scholar_settings');
    if (key) localStorage.setItem(key, JSON.stringify(settings));
  }, [settings, user]);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
    localStorage.setItem('is_auth', 'true');
    localStorage.setItem('user_name', username);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('is_auth');
    localStorage.removeItem('user_name');
  };

  const addNewApplication = (app: ScholarshipApplication) => {
    const updatedDocs = app.documents.map(doc => {
      if (doc.isReusable) {
        const existing = reusableDocs.find(r => r.name.toLowerCase() === doc.name.toLowerCase());
        if (existing) {
          return { ...doc, status: existing.status, fileUrl: existing.fileUrl };
        }
        // If it's a new reusable doc, add it to our global library
        const newLibraryDoc = { ...doc, id: `r-${Date.now()}-${Math.random()}` };
        setReusableDocs(prev => [...prev, newLibraryDoc]);
        return newLibraryDoc;
      }
      return doc;
    });

    setApplications(prev => [{ ...app, documents: updatedDocs }, ...prev]);
  };

  const updateApplication = (updatedApp: ScholarshipApplication) => {
    setApplications(prev => prev.map(app => 
      app.id === updatedApp.id ? updatedApp : app
    ));

    // Sync changes back to global library for any reusable documents
    updatedApp.documents.forEach(doc => {
      if (doc.isReusable) {
        setReusableDocs(prev => prev.map(r => 
          r.name.toLowerCase() === doc.name.toLowerCase() 
            ? { ...r, status: doc.status, fileUrl: doc.fileUrl } 
            : r
        ));
      }
    });
  };

  const updateAppStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };

  // Global Library Management
  const addReusableDoc = (name: string) => {
    const newDoc: Document = {
      id: `r-${Date.now()}`,
      name,
      isReusable: true,
      status: DocStatus.PENDING
    };
    setReusableDocs(prev => [...prev, newDoc]);
  };

  const updateReusableDoc = (updatedDoc: Document) => {
    setReusableDocs(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    
    // Sync library updates back to all applications that use this document
    setApplications(prev => prev.map(app => ({
      ...app,
      documents: app.documents.map(d => 
        d.isReusable && d.name.toLowerCase() === updatedDoc.name.toLowerCase()
          ? { ...d, status: updatedDoc.status, fileUrl: updatedDoc.fileUrl }
          : d
      )
    })));
  };

  const deleteReusableDoc = (id: string) => {
    setReusableDocs(prev => prev.filter(d => d.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowLogin(true)} />
        {showLogin && (
          <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />
        )}
      </>
    );
  }

  return (
    <Router>
      <Layout onLogout={handleLogout} username={user || 'User'}>
        <Routes>
          <Route path="/" element={<Dashboard applications={applications} />} />
          <Route path="/new" element={
            <NewApplicationWizard 
              onComplete={(app) => {
                addNewApplication(app);
                window.location.hash = '#/applications';
              }} 
              reusableDocs={reusableDocs}
            />
          } />
          <Route path="/applications" element={
            <ApplicationList 
              applications={applications} 
              onStatusChange={updateAppStatus} 
            />
          } />
          <Route path="/applications/:id" element={
            <ApplicationDetailsWrapper 
              applications={applications} 
              onUpdate={updateApplication} 
              settings={settings}
            />
          } />
          <Route path="/documents" element={
            <DocumentLibrary 
              documents={reusableDocs}
              onAdd={addReusableDoc}
              onUpdate={updateReusableDoc}
              onDelete={deleteReusableDoc}
              settings={settings}
            />
          } />
          <Route path="/settings" element={
            <Settings settings={settings} onSave={setSettings} />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
