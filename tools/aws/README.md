## AWS - Launch Instance Instructions

### Step #1
---
    Create a Key Pair
    a. Open AWS Console
    b. Go To EC2
    c. Key Pairs
    d. Create Key Pair ( A key will be downloaded that will be used to access the machine )
---

### Step #2
---
    Create VM
    a. Open AWS Console
    b. Go To EC2
    c. Open Instances
    d. Press Launch Instance
        i. Check 'Free tier only'
        ii. Select 'Amazon Linux 2 AMI (HVM), SSD Volume Type'
        iii. Instance Type: t2.micro
        iv. Keep pressing Next untill the 'Configure Security Group'
        v. 
            1. Add Rule 'SSH' - 22 - should be configured by default
            2. Add Rule 'HTTP' - Port 80
            3. Add Rule 'MYSQL/Aurora' - 3306
            4*. For All - Set Source to anywhere for all the rules
        vi. Now you can launch the instance... 
---