# Capstone Project: Terraform & Kubernetes Deployment

This document outlines the implementation details of a fully automated CI/CD pipeline using Jenkins, Terraform, and Kubernetes. It also provides details about the **JobsApp** project, which consists of three main services: Auth Service, User Service, and Company Service. These services manage user authentication, profile details, and company information.

**Main Repository for JobsApp MERN Application**: [JobsApp](https://github.com/UnpredictablePrashant/JobsApp)
   - MERN stack application with APIs for job postings, user authentication, and more.

The deployment repository is split into two parts:

1. **Terraform Repository**: [CapstoneProject-Terraform](https://github.com/arpit1605/CapstoneProject-Terraform.git)
   - Responsible for provisioning the required cloud infrastructure.

2. **Kubernetes Repository**: [CapstoneProject-Kubernetes](https://github.com/arpit1605/CapstoneProject-Kubernetes.git)
   - Contains the application code, docker files, and Kubernetes manifests for deployment.


---


## Architecture Diagram

Below is the architecture diagram of the deployment:

![image](https://github.com/user-attachments/assets/99d2ba68-70e8-44d8-8fd0-2371e3c620a2)


The architecture includes:
- **Terraform**: Provisions the cloud infrastructure.
- **Kubernetes**: Manages the JobsApp application containers.
- **Jenkins**: Automates CI/CD pipelines.
- **Docker**: Builds and packages the application services.

---

## Jobsapp API Services Overview

### Services Overview

#### **Auth Service** (Authentication and User Management)
- **Base URL:** `https://api.internsheep.in/auth`
- **Endpoints:**
  - `/register` (POST): Register a new user.
  - `/login` (POST): Authenticate a user and return a JWT token.
  - `/protected` (GET): Access a protected route requiring JWT.

#### **User Service** (User Profile and Data Management)
- **Base URL:** `https://api.internsheep.in/user`
- **Endpoints:**
  - `/profile` (POST/GET): Create, update, or fetch a user profile.
  - `/profile/:id` (GET): Get a specific profile by ID.
  - `/profile/education` (POST): Add education details.
  - `/profile/work` (POST): Add work experience.

#### **Company Service** (Company Management)
- **Base URL:** `https://api.internsheep.in/company`
- **Endpoints:**
  - `/` (POST/GET/DELETE): Create, update, fetch, or delete a company.
  - `/logo` (POST): Upload a company logo.

---

### Environment Variables

#### **Auth Service**
| Variable       | Description                        | Example                          |
| -------------- | ---------------------------------- | -------------------------------- |
| PORT           | The port on which the service runs | `5000`                           |
| MONGO_URI      | MongoDB connection string          | `mongodb://mongo:27017/intsheep` |
| JWT_SECRET     | Secret key for signing JWT tokens  | `someshittyjwttokenisbeingused`  |
| REDIS_HOST     | Redis server hostname              | `redis`                          |
| REDIS_PORT     | Redis server port                  | `6379`                           |
| KAFKA_BROKERS  | Kafka broker connection string     | `kafka:9092`                     |

#### **User Service**
| Variable             | Description                        | Example                          |
| -------------------- | ---------------------------------- | -------------------------------- |
| PORT                 | The port on which the service runs | `5001`                           |
| MONGO_URI            | MongoDB connection string          | `mongodb://mongo:27017/intsheep` |
| JWT_SECRET           | Secret key for signing JWT tokens  | `someshittyjwttokenisbeingused`  |
| REDIS_HOST           | Redis server hostname              | `redis`                          |
| REDIS_PORT           | Redis server port                  | `6379`                           |
| AWS_REGION           | AWS region for S3 bucket           | `us-east-1`                      |
| AWS_ACCESS_KEY_ID    | AWS access key for S3              | `your-access-key-id`             |
| AWS_SECRET_ACCESS_KEY| AWS secret access key for S3       | `your-secret-access-key`         |
| AWS_S3_BUCKET_NAME   | AWS S3 bucket name                 | `your-s3-bucket-name`            |

#### **Company Service**
| Variable             | Description                        | Example                          |
| -------------------- | ---------------------------------- | -------------------------------- |
| PORT                 | The port on which the service runs | `5002`                           |
| MONGO_URI            | MongoDB connection string          | `mongodb://mongo:27017/intsheep` |
| JWT_SECRET           | Secret key for signing JWT tokens  | `someshittyjwttokenisbeingused`  |
| REDIS_HOST           | Redis server hostname              | `redis`                          |
| REDIS_PORT           | Redis server port                  | `6379`                           |
| AWS_REGION           | AWS region for S3 bucket           | `us-east-1`                      |
| AWS_ACCESS_KEY_ID    | AWS access key for S3              | `your-access-key-id`             |
| AWS_SECRET_ACCESS_KEY| AWS secret access key for S3       | `your-secret-access-key`         |
| AWS_S3_BUCKET_NAME   | AWS S3 bucket name                 | `your-s3-bucket-name`            |

---


## Project Directory Structure

### Terraform Repository
```
Terraform
├── backend.tf            # Configures the Terraform backend storage
├── main.tf               # Defines the main infrastructure resources
├── modules               # Contains modular Terraform components
│   ├── eks               # EKS Cluster configuration
│   │   ├── main.tf       # Creates the EKS cluster
│   │   ├── outputs.tf    # Outputs for EKS module
│   │   └── variables.tf  # Input variables for EKS module
│   ├── iam               # IAM Role and Policies
│   │   ├── main.tf       # Defines IAM roles and policies
│   │   ├── outputs.tf    # Outputs for IAM module
│   │   └── variables.tf  # Input variables for IAM module
│   ├── vpc               # Virtual Private Cloud (VPC) setup
│   │   ├── main.tf       # Creates VPC resources
│   │   ├── outputs.tf    # Outputs for VPC module
│   │   └── variables.tf  # Input variables for VPC module
├── outputs.tf            # Specifies Terraform output values
├── variables.tf          # Defines input variables for Terraform
```

### Kubernetes Repository
```
k8s
├── namespace.yml          # Defines namespace for application deployment
├── ingress.yml            # Manages external access to services
├── backend
│   ├── authservice        # Authentication microservice
│   │   ├── deployment.yml # Deployment configuration for Auth Service
│   │   ├── service.yml    # Service configuration for Auth Service
│   ├── companyservice     # Company management microservice
│   │   ├── deployment.yml # Deployment configuration for Company Service
│   │   ├── service.yml    # Service configuration for Company Service
│   ├── userservice        # User management microservice
│   │   ├── deployment.yml # Deployment configuration for User Service
│   │   ├── service.yml    # Service configuration for User Service
│   ├── backend-secrets.yml # Secrets for backend services
├── database
│   ├── mongodb-deployment.yml # MongoDB database deployment
│   ├── mongodb-pv.yml         # MongoDB Persistent Volume configuration
│   ├── mongodb-pvc.yml        # MongoDB Persistent Volume Claims
│   ├── mongodb-service.yml    # MongoDB Service configuration
│   ├── redis-deployment.yml   # Redis cache deployment
│   ├── redis-service.yml      # Redis service configuration
├── monitoring             
│   ├── grafana-deployment.yml    # Grafana deployment
│   ├── grafana-service.yml       # Grafana service configuration
│   ├── prometheus-config.yml     # Prometheus configuration file
│   ├── prometheus-deployment.yml # Prometheus deployment
│   ├── prometheus-service.yml    # Prometheus service configuration
├── utils                  
│   ├── kafka-deployment.yml      # Kafka deployment
│   ├── kafka-service.yml         # Kafka service configuration
│   ├── zookeeper-deployment.yml  # Zookeeper deployment
│   ├── zookeeper-service.yml     # Zookeeper service configuration
```

### Docker Repository
```
backend
├── authService
│   └── Dockerfile         # Builds the auth service container
├── companyService
│   └── Dockerfile         # Builds the company service container
├── userService
│   └── Dockerfile         # Builds the user service container
├── docker-compose.yml     # Docker Compose file to run multiple services locally
```

---


## Workflow Overview

- **Trigger Mechanism**:
  - Updates to the **Terraform repository** (`main` branch) trigger the Terraform pipeline to provision/update infrastructure.
  - Updates to the **Kubernetes repository** (`main` branch) trigger the application deployment pipeline.
  - When the Terraform repository pipeline is triggered, it sequentially triggers the Kubernetes deployment pipeline.

- **Automation**:
  - **GitHub Webhooks**: Used to trigger Jenkins pipelines on changes to the respective repositories.

### We use GitHub Webhooks to automate the triggering of Jenkins pipelines. When a push event occurs in the respective repositories, Jenkins pipelines are triggered accordingly.

#### **Setting Up GitHub Webhooks:**
1. Navigate to the **GitHub Repository Settings** → **Webhooks**.
2. Click on **"Add webhook"**.
3. Set the **Payload URL** to your Jenkins webhook endpoint:
   ```
   http://<JENKINS_URL>/github-webhook/
   ```
4. Select **application/json** as the Content-Type.
5. Choose **"Just the push event"**.
6. Click **Add webhook**.

Now, Jenkins will trigger the appropriate pipeline whenever a push event occurs in the repository.
---


---

## Step-by-Step Deployment

---

## **Jenkins Pipeline Execution Flow**

### **1. Terraform Repository Updates (Main Branch)**
- Triggers the **Terraform Pipeline**.
- Provisions/updates the infrastructure.
- On successful completion, **triggers the Kubernetes deployment pipeline**.

### **2. Kubernetes Repository Updates (Main Branch)**
- Triggers the **Application Deployment Pipeline** to deploy the latest application version.

### **3. Workflow Automation**
| Event | Triggered Pipeline | Additional Actions |
|--------|--------------------|--------------------|
| Push to Terraform Repository | **Terraform Pipeline** | ✅ Provisions infrastructure<br>✅ Triggers Kubernetes Pipeline |
| Push to Kubernetes Repository | **Kubernetes Deployment Pipeline** | ✅ Deploys latest app version |

![JenkinsPipeline](https://github.com/user-attachments/assets/ec50374c-a6c8-442e-8be7-83c86e79baf2)

---

## **Terraform Pipeline Configuration**
- The Terraform pipeline automatically provisions infrastructure.
- It includes error handling to rollback changes on failure.
- On successful execution, it triggers the Kubernetes deployment pipeline.

### **Triggering Kubernetes Pipeline from Terraform Pipeline**
```groovy
stage('Trigger Kubernetes Deployment Pipeline') {
    steps {
        script {
            build job: "Kubernetes-Deployment-Pipeline", wait: true
        }
    }
}
```
- This ensures that the Kubernetes deployment pipeline runs immediately after Terraform provisioning.

---

## **Kubernetes Deployment Pipeline Configuration**
- Deploys backend services and database infrastructure.
- Uses `kubectl apply` to manage deployment configurations.
- Exposes services using Ingress.

### **Ensuring Proper Service Exposure**
- Services are exposed using **Ingress** (`k8s/ingress.yml`)
- Persistent storage for MongoDB is handled via **PV/PVC** (`k8s/database/mongodb-pv.yml` & `mongodb-pvc.yml`)
- Secrets are stored in **backend-secrets.yml**

---

## Security Best Practices for Jenkins

### Secure Credentials Storage
- Use Jenkins **Credentials Plugin** to store sensitive information like AWS access keys and Docker Hub credentials.
- Navigate to **Manage Jenkins** → **Manage Credentials** → **Global** and add credentials securely.

### Pipeline Security
- Avoid storing secrets directly in the `Jenkinsfile`.
- Use `withCredentials()` block to securely access stored secrets.

### Access Control
- Enable **Role-Based Access Control (RBAC)** in Jenkins.
- Restrict access to sensitive pipelines and credentials.

### GitHub Webhooks in Jenkins
- Navigate to **Manage Jenkins** → **Configure System**.
- Under **GitHub Webhook**, enable **Automatically manage hooks**.
- Add Jenkins webhook URL in GitHub under **Settings** → **Webhooks**.

---

## Final Summary

- **Terraform provisions** the infrastructure and triggers the **Kubernetes deployment pipeline**.
- **Kubernetes pipeline** deploys the application, database, monitoring stack, and Kafka/Zookeeper.
- **GitHub Webhooks** ensure a fully automated CI/CD workflow.
- **Security best practices** have been implemented to safeguard credentials and limit unauthorized access.

🚀 Now the entire deployment is automated with seamless Terraform and Kubernetes integration, following security best practices!

---

## Notes

- Ensure all **environment variables** are correctly configured in Jenkins.
- Verify the **service exposure** via Ingress before accessing deployed applications.
- Maintain proper documentation for **infrastructure updates**.
- Continuously monitor **Jenkins, Kubernetes, and Terraform logs** for any anomalies or failures.

---
