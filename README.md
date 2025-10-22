# CSE3CWA – Cloud-Based Web Application (Assignment 2)

## Overview
This repository contains the implementation for **Assignment 2** of **CSE3CWA – Cloud-Based Web Applications**.  
The project demonstrates the deployment of a modern cloud-based web application using **containerisation**, **AWS EC2**, **AWS Lambda**, and **monitoring, testing, and instrumentation** for observability.  
It extends the work completed in Assignment 1 by applying practical cloud computing and DevOps principles in a real cloud environment.

---

## Learning Objectives Demonstrated
- Deploy a containerised web application using **Docker**
- Host and manage the application on **AWS EC2**
- Implement **serverless functionality** with **AWS Lambda**
- Apply **monitoring, testing, and instrumentation** to ensure performance and reliability

---

## Technologies Used
| Category | Tools / Services |
|-----------|------------------|
| Frontend | Next.js, HTML5, CSS3 |
| Backend | Node.js |
| Containerisation | Docker, Docker Compose |
| Cloud Platform | AWS EC2 & AWS Lambda |
| Monitoring / Testing / Instrumentation | AWS CloudWatch, Grafana (conceptual), Jest |
| Version Control | Git & GitHub |

---

## Docker and Containerisation
The web application was containerised to ensure consistency across development and production environments.  
Docker simplified deployment by packaging dependencies and configurations into a single lightweight image.  
Testing confirmed successful execution in both local and cloud environments, verifying that the containerised setup performed as expected.

---

## AWS Deployment
The containerised web application was deployed to an **AWS EC2 instance** running Ubuntu Linux.  
Setup included installing Docker, cloning the GitHub repository, and configuring AWS security groups to allow HTTP and SSH access.  
After deployment, the application was verified using the instance’s public DNS, confirming accessibility through the web.  
This demonstrated the ability to host a containerised application in a live cloud environment with persistent availability.

---

## AWS Lambda
A **serverless function** was developed and deployed using **AWS Lambda** to demonstrate dynamic content generation.  
The function was connected to an **API Gateway** endpoint, allowing it to process HTTP requests and return responses without requiring a dedicated backend server.  
Testing validated the Lambda’s successful execution and response handling, showcasing the use of serverless computing within the cloud-based system.

---

## Monitoring, Testing, and Instrumentation

**Testing Overview**  
Comprehensive testing was carried out using Jest, Playwright, Lighthouse, JMeter, and instrumentation metrics to ensure correctness, reliability, and performance of the application.

---

### Jest (Integration Tests)
Jest was used to validate backend API routes related to the Escape Room module.  
The tests confirmed that core database operations executed successfully and that routes returned the correct responses.

**Executed Tests:**
- **api.saveRun.test.ts** – verified that a new escape room run is saved successfully.  
- **api.getRun.test.ts** – confirmed retrieval of a previously saved escape room run.  

**Results:**
- Test Suites: 2 passed (2 total)  
- Tests: 3 passed (3 total)  
- Execution Time: ≈ 0.965 s  
- Snapshots: 0  
✅ *All integration tests passed successfully.*

---

### Playwright (End-to-End Testing)
Playwright simulated real user interaction in Chromium to validate front-end logic and persistence.

**Executed Tests:**
1. **Count down 10 seconds and save run** — verified countdown timer and save API. *(18.7 s)*  
2. **Load latest run and confirm JSON** — validated retrieval of saved data. *(20.4 s)*  

**Results:**
- Browser: Chromium  
- Test Suites: 2 passed (2 total)  
✅ *All end-to-end tests passed, confirming complete functional flow.*

---

### Lighthouse (Performance, Accessibility, and SEO)
Lighthouse audit was conducted in **production mode** on `/escape-room`.

| Category | Score |
|-----------|--------|
| Performance | **100** |
| Accessibility | **94** |
| Best Practices | **100** |
| SEO | **100** |

✅ *Final audit achieved near-perfect results, demonstrating full optimisation.*

---

### Apache JMeter (Load and Stress Testing)
Load testing verified backend stability and response time of the `/api/outputs` endpoint under concurrent requests.

**Configuration:**
- Total Requests: 10  
- Threads: 10 (simulated users)  
- Duration: ~1 minute  

**Results Summary:**
| Metric | Result |
|--------|---------|
| Average Response Time | 5.7 ms |
| Min / Max Response Time | 5 ms / 7 ms |
| Throughput | 2.22 requests/sec |
| Error Rate | 0% |
| Apdex (Performance Index) | 1.000 (Excellent) |

✅ *All requests completed successfully with no failures or performance degradation.*

---

## Demonstration Video
A recorded walkthrough demonstrating the Docker build, AWS EC2 deployment, Lambda function execution, and monitoring setup will be available once uploaded.  
**[View on OneDrive]([https://link-to-onedrive-video](https://latrobeuni-my.sharepoint.com/:v:/g/personal/20224948_students_ltu_edu_au/EWpm_Hgj0f5MlIZpvfz8vNMBIg4Fc8wtnhT1gjqwOhuidQ?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=KIQkNL))**

---

## Author
**Mark Prado**  
Student ID: 20224948  
Bachelor of Information Technology – La Trobe University  
Subject: CSE3CWA (BU-OL-BE-SY-2)

---

