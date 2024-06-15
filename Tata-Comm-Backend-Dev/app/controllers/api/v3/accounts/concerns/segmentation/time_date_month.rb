module Api::V3::Accounts::Concerns::Segmentation::TimeDateMonth
  def times
    [
      { "12am-1am": 0 },
      { "1am-2am": 1 },
      { "2am-3am": 2 },
      { "3am-4am": 3 },
      { "4am-5am": 4 },
      { "5am-6am": 5 },
      { "6am-7am": 6 },
      { "7am-8am": 7 },
      { "8am-9am": 8 },
      { "9am-10am": 9 },
      { "10am-11am": 10 },
      { "11am-12pm": 11 },
      { "12pm-1pm": 12 },
      { "1pm-2pm": 13 },
      { "2pm-3pm": 14 },
      { "3pm-4pm": 15 },
      { "4pm-5pm": 16 },
      { "5pm-6pm": 17 },
      { "6pm-7pm": 18 },
      { "7pm-8pm": 19 },
      { "8pm-9pm": 20 },
      { "9pm-10pm": 21 },
      { "10pm-11pm": 22 },
      { "11pm-12am": 23 }
    ]
  end

  def weekdays
    [
      { "Sunday": 0 },
      { "Monday": 1 },
      { "Tuesday": 2 },
      { "Wednesday": 3 },
      { "Thursday": 4 },
      { "Friday": 5 },
      { "Saturday": 6 }
    ]
  end

  def months
    [
      { "January": 1 },
      { "February": 2 },
      { "March": 3 },
      { "April": 4 },
      { "May": 5 },
      { "June": 6 },
      { "July": 7 },
      { "August": 8 },
      { "September": 9 },
      { "October": 10 },
      { "November": 11 },
      { "December": 12 }
    ]
  end
end
