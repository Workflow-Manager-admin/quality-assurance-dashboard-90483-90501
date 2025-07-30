#!/bin/bash
cd /home/kavia/workspace/code-generation/quality-assurance-dashboard-90483-90501/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

