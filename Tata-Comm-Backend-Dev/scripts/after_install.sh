#!/bin/bash
# cd /home/ubuntu
# sudo cp -rf /home/ubuntu/backend-repo/ /home/engage/Engage-3-Backend/
# sudo chown -R root /home/engage/Engage-3-Backend/backend-repo
# cd /home/engage/Engage-3-Backend/backend-repo/
# runuser -l engage -c '
# cd Engage-3-Backend/backend-repo
# bundle
# RAILS_ENV=production rails db:migrate DISABLE_DATABASE_ENVIRONMENT_CHECK=1
# '
# sudo cp /home/engage/Engage-3-Backend/backend-repo/deployment/engage-web.1.service /etc/systemd/system/engage-web.1.service
# sudo cp /home/engage/Engage-3-Backend/backend-repo/deployment/engage-worker.1.service /etc/systemd/system/engage-worker.1.service
# sudo cp /home/engage/Engage-3-Backend/backend-repo/deployment/engage.target /etc/systemd/system/engage.target
echo "in after_install.sh"