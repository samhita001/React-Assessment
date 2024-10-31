import React from 'react';
import { FormContainer } from './components/FormContainer';
import { initializeIcons } from '@fluentui/react';

initializeIcons();

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Page Layout Metadata Form</h1>
      <FormContainer />
    </div>
  );
};

export default App;
