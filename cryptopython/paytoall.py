import os
import mysql.connector
import time
from subprocess import Popen, PIPE

def main():
    mydb = mysql.connector.connect(
        host="195.245.113.247",
        user="dbuser",
        passwd="Redmoon2020",
        database="transaction"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM user_info")
    myresult = mycursor.fetchall()
    with open('history.hst', 'r') as f:
        history = f.read()
    #os.system('"C:\Program Files (x86)\Electrum\electrum-4.3.2-debug.exe" daemon -d')
    #os.system('"C:\Program Files (x86)\Electrum\electrum-4.3.2-debug.exe" load_wallet')
    for x in myresult:
        if x[2] not in history:
            payto = Popen('"C:\Program Files (x86)\Electrum\electrum-4.3.2-debug.exe" payto ' + x[2] + ' ' + x[1], stdout=PIPE)
            broadcast = Popen('"C:\Program Files (x86)\Electrum\electrum-4.3.2-debug.exe" broadcast -', stdout=PIPE, stdin=payto.stdout)
            stdout = broadcast.communicate()
            print(stdout)
            print('electrum -o payto '+ x[2] + ' ' + x[1])
            with open('history.hst', 'a') as f:
                f.write('\n' + x[2])
        else:
            print('Already paid ' + x[2] + ' skipping (Remove address from history.hst if you want to pay again)')

#run every 5 minutes
#print the last time it ran
while True:
    os.system('cls')
    #os.system('"C:\Program Files (x86)\Electrum\electrum-4.3.2.exe" daemon -d')
    print('Last time ran: ' + time.strftime("%H:%M:%S"))
    main()
    time.sleep(300)