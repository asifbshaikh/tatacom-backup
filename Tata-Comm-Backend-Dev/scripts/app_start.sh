#!/bin/bash
# sudo ps -ef | grep sidekiq | grep -v 'grep' | awk '{print $2}' | xargs kill -9
# sudo kill -9 $(cat /home/engage/Engage-3-Backend/backend-repo/tmp/pids/server.pid)

# echo $PWD 

# echo "Starting sidekiq service"
# sudo systemctl enable sidekiq.service
# sudo systemctl start sidekiq.service
# if [ $? -eq 0 ]
# then
#     echo "execution sucessfull"
#     echo "Starting Rails server"
#     sudo -u engage -i bash -c "cd Engage-3-Backend/backend-repo && RAILS_ENV=production bundle exec rails server -e production -p 3050 -d"
#     sudo systemctl status sidekiq.service
#     exit
# else
#     echo "execution failed"
# fi
echo "in app_start.sh"