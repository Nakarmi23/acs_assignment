# Table of Content

- [Table of Content](#table-of-content)
- [Advance Cyber Security Assignment](#advance-cyber-security-assignment)
  - [Introduction](#introduction)
    - [Requirements](#requirements)
    - [Project Setup](#project-setup)
  - [Features Implemented](#features-implemented)

# Advance Cyber Security Assignment

## Introduction

This project uses Lerna with Yarn Workspaces to manage and run two sub-projects (frontend and backend). The backend project uses Nodejs, MongoDB and Express js and the frontend project uses React js and Typescript.

### Requirements

- Nodejs v16.15.1
- MongoDB v5.0.9

### Project Setup

- Download and install [Nodejs](https://nodejs.org/en/download/).
- Download and install [MongoDB](https://www.mongodb.com/try/download/community)
- Install yarn

  ```shell
  npm i -g yarn      # You may need to use sudo if you're on Mac OS or Linux device
  ```

  - (Only for Windows) If an error message come up saying "The execution of scripts is disabled on this system". You may need to set the execution policy to "Unrestricted" or "RemoteSigned" on Powershell.

    - Open PowerShell as an Administrator
    - Run the following command to see the current execution policy
      ```shell
      Get-ExecutionPolicy       # Here you'll see 'Restricted'
      ```
    - Now run the following command to change the execution policy to "Unrestricted" or "RemoteSigned"

      ```
      shell Set-ExecutionPolicy Unrestricted
      ```

      or

      ```shell
       Set-ExecutionPolicy RemoteSigned
      ```

      > You can learn more about "Unrestricted" and "RemoteSigned" [here](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-5.1#remotesigned).

- Open terminal from the root of the project
- Install all the dependencies
  ```shell
  yarn install
  ```
- Run both frontend and backend servers
  ```shell
  yarn dev  # this command will run both frontend and backend servers in parallel
  ```
  Wait until you receive the following messages:
  ```shell
  [frontend]   vite v2.9.12 dev server running at:
  [frontend]
  [frontend]   > Local: http://localhost:3000/
  [frontend]   > Network: use `--host` to expose
  [frontend]
  [frontend]   ready in 545ms.
  ```
  ```shell
  [backend] Connected database
  [backend] Server is running on port 8000
  ```
- After both servers are running Open your browser and go to http://localhost:3000/ and start using the application

## Features Implemented

Below is a list of all security features that are implemented in this project:

- Captcha v2
- Password Strength indicator
- Old password check
- Frequency of Change <small>(Recommends password change if the user has not changed their password for 60 or more days.)</small>
- Rate Limit on all API endpoints <small>(Block users from sending requests for 15 mins if number of requests exceeds 15 within 5 seconds)</small>
- Limit login attempts <small>(Block users from logging in for 30 mins if they fail to successfully login after 5 attempts within 15 mins)</small>
- Password hashing
