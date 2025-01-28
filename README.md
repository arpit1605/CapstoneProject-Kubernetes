# Capstone Project: Terraform & Kubernetes Deployment

This project demonstrates deploying a MERN stack application, **JobsApp**, using infrastructure automation with Terraform and container orchestration using Kubernetes. The repository is split into two parts:

1. **JobsApp Application**: [JobsApp](https://github.com/UnpredictablePrashant/JobsApp)
   - MERN stack application with APIs for job postings, user authentication, and more.

2. **Terraform Repository**: [CapstoneProject-Terraform](https://github.com/arpit1605/CapstoneProject-Terraform.git)
   - Responsible for provisioning the required cloud infrastructure.

3. **Kubernetes Repository**: [CapstoneProject-Kubernetes](https://github.com/arpit1605/CapstoneProject-Kubernetes.git)
   - Contains the application code, docker files, and Kubernetes manifests for deployment.


---

## Workflow Overview

- **Trigger Mechanism**:
  - Updates to the **Terraform repository** (`main` branch) trigger the Terraform pipeline to provision/update infrastructure.
  - Updates to the **Kubernetes repository** (`main` branch) trigger the application deployment pipeline.
  - When the Terraform repository pipeline is triggered, it sequentially triggers the Kubernetes deployment pipeline.

- **Automation**:
  - **GitHub Webhooks**: Used to trigger Jenkins pipelines on changes to the respective repositories.

---

## Architecture Diagram

Below is a placeholder for the architecture diagram of the deployment:

![Architecture Diagram](<Add-your-diagram-link-here>)

The architecture includes:
- **Terraform**: Provisions the cloud infrastructure.
- **Kubernetes**: Manages the JobsApp application containers.
- **Jenkins**: Automates CI/CD pipelines.
- **Docker**: Builds and packages the application services.

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
│   │   ├── backend-secrets.yml # Secrets for backend services
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

## Step-by-Step Deployment

### 1. **Infrastructure Deployment with Terraform**

#### Repository: CapstoneProject-Terraform

1. Clone the repository:
   ```bash
   git clone https://github.com/arpit1605/CapstoneProject-Terraform.git
   cd CapstoneProject-Terraform
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Validate the configuration:
   ```bash
   terraform validate
   ```

4. Create a plan for infrastructure changes:
   ```bash
   terraform plan -out=tfplan
   ```

5. Apply the changes to provision infrastructure:
   ```bash
   terraform apply tfplan
   ```

6. Verify infrastructure resources are created successfully:
   - Check Terraform output for created resources:
     ```bash
     terraform output
     ```
   - Log in to the cloud provider console to verify the created infrastructure (e.g., VPC, EKS cluster).

7. Check Terraform logs for any warnings or errors during execution to ensure a smooth deployment.

---

### 2. **Infrastructure Deployment with Kubernetes**

#### Repository: CapstoneProject-Kubernetes

1. Clone the repository:
   ```bash
   git clone https://github.com/arpit1605/CapstoneProject-Kubernetes.git
   cd CapstoneProject-Kubernetes
   ```

2. Build and Push Docker Images:
   ```bash
   docker-compose up --build
   docker build -t arpit1605/jobsapp-authservice-backend:v1 backend/authService
   docker build -t arpit1605/jobsapp-companyservice-backend:v1 backend/companyService
   docker build -t arpit1605/jobsapp-userservice-backend:v1 backend/userService
   docker push arpit1605/jobsapp-authservice-backend:v1
   docker push arpit1605/jobsapp-companyservice-backend:v1
   docker push arpit1605/jobsapp-userservice-backend:v1
   ```

3. Deploy the application:
   ```bash
   kubectl apply -f k8s/namespace.yml
   kubectl apply -f k8s/database
   kubectl apply -f k8s/backend
   kubectl apply -f k8s/ingress.yml
   ```

4. Verify deployment:
   ```bash
   kubectl get pods -n backend
   kubectl get services -n backend
   ```

---


## Security Best Practices for Jenkins

1. **Secure Credentials Storage**:
   - Use Jenkins **Credentials Plugin** to store sensitive information like AWS access keys and Docker Hub credentials.
   - Navigate to **Manage Jenkins** → **Manage Credentials** → **Global** and add credentials securely.

2. **Pipeline Security**:
   - Avoid storing secrets directly in the `Jenkinsfile`.
   - Use `withCredentials()` block to securely access stored secrets.

3. **Access Control**:
   - Enable Role-Based Access Control (RBAC) in Jenkins.
   - Restrict access to sensitive pipelines and credentials.

4. **GitHub Webhooks in Jenkins**:
   - Navigate to **Manage Jenkins** → **Configure System**.
   - Under **GitHub Webhook**, enable **Automatically manage hooks**.
   - Add Jenkins webhook URL in GitHub under **Settings** → **Webhooks**.

---

## Notes

- Ensure that secrets and sensitive information are managed securely (e.g., using Kubernetes secrets or environment variables).
- Use monitoring tools like Prometheus or Grafana to observe the application in production.
- Troubleshoot any issues by checking logs, debugging Kubernetes resources, and verifying Terraform states.

---
