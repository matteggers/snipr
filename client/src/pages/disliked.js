import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useArticles } from '../hooks/useArticles.js';
import { SectionTitle } from '../components/SectionTitle.js';


function DislikedPage() {
  return (
    <div>
      <SectionTitle name="Disliked" />
    </div>
  );
  
}

export default DislikedPage;