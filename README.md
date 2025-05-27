# BahnarSource

This README provides instructions on how to run the different components of the BahnarSource project. The project consists of two main parts: a translation application and a model service.

## Project Components:

1. **Translation Application (`vietnamese-bahnaric-frontend-v3`):** 
   - Contains both the backend and frontend of the translation software
   - Provides the user interface and handles translation requests
   - Communicates with the BARTViBa model service

2. **Model Service (`BARTViBa`):**
   - A standalone service that provides the translation model
   - Used by the translation application to perform actual translations

## How to Run:

To run the complete project, you must follow this specific order:

1. Start the BARTViBa model service first
2. Then start the translation application

This order is important because the translation application depends on the model service being available.

### 1. Running the Model Service (`BARTViBa`) - Run this first!

Navigate to the `BARTViBa` directory:

```bash
cd BARTViBa
```

This is a separate service that provides the translation model. Please refer to the README.md or other documentation within this directory for instructions on:
- Setting up the Python environment
- Installing dependencies (e.g., using `pip install -r requirements.txt`)
- Running the model service

Make sure the model service is running properly before proceeding to the next step.

### 2. Running the Translation Application (`vietnamese-bahnaric-frontend-v3`) - Run this after BARTViBa is running

Navigate to the `vietnamese-bahnaric-frontend-v3` directory:

```bash
cd vietnamese-bahnaric-frontend-v3
```

This directory contains both the backend and frontend components. Please refer to the specific README.md or other documentation files within this directory for detailed instructions on:
- Setting up the environment
- Installing dependencies for both backend and frontend
- Running the application (both backend server and frontend development server)

## Integration

The translation application (`vietnamese-bahnaric-frontend-v3`) is configured to communicate with the BARTViBa model service. Make sure both services are running and properly configured to work together.

Please refer to the individual README files within each directory for the most accurate and detailed instructions specific to each component.
