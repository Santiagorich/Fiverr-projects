#import matplotlib
#matplotlib.use('TkAgg',force=True) # prevents the message/warning "Backend TkAgg is interactive backend. Turning interactive mode on."
import matplotlib.pyplot as plt
import random
import os
import time 
import pandas as pd
import quantstats as qs
import webbrowser

path = r"."
fullFileHtml = os.path.join(path,'quandstats_report_within_compiled_code_test.html')

def generate_html_reports():
    df1 = pd.read_csv(r"BTCBUSD.csv")
    #df1.index = pd.to_datetime(df1.index)
    df1["Date"] = pd.to_datetime(df1["Date"])
    df1.set_index("Date",drop=True,inplace=True)
    
    df2 = pd.read_csv(r"ETHBUSD.csv")
    df2["Date"] = pd.to_datetime(df2["Date"])
    df2.set_index("Date",drop=True,inplace=True)
    #df2.index = pd.to_datetime(df2.index).strftime('%d-%m-%Y')
    featuresEval = 0
    benchmarkEval = 0

    doCreateSnapshot=False

    equityPercentChange1 = df1["Close"].pct_change()#featuresEval["equity"].pct_change()
    equityPercentChange2 = df2["Close"].pct_change()#featuresEval["equity"].pct_change()
    
    if doCreateSnapshot:
        fullFileSnapshot = os.path.join(path,"quandstats_snapshot_within_compiled_code_test.png")           
        qs.plots.snapshot(equityPercentChange1, title='Equity Snapshot - {}', show=True, savefig=fullFileSnapshot) # can also be called via: stock.plot_snapshot(title='Facebook Performance')
    
    #try:
    qs.reports.html(equityPercentChange1,  benchmark=equityPercentChange2, output=fullFileHtml) #, benchmark=benchmark
    #except:
    #    print("WARNING: failed executing qs.reports.html(...). One known reason is that it can't handle time-intervals other than 1d,1h")
    #return

def plot_something():
    y = list(range(100))
    y = [el+random.randrange(3)-1 for el in y]
    fig,ax = plt.subplots()
    ax.plot(y)
    fig.show()
    return fig,ax

def remove_png(fileName):
    didFileExist = os.path.exists(fileName)
    if didFileExist:
        print(f"Deleting previous plot file {testPlotFile} before plotting/saving again")    
        os.remove(fileName)
    return didFileExist

try:
    generate_html_reports()
    webbrowser.open('file://' + os.path.realpath(fullFileHtml))
except Exception as e:
    print(str(type(e))+" : "+str(e))    

if os.path.exists(fullFileHtml):
    print(f"SUCCESS! Quandstats-html file {fullFileHtml} has been written within this function")
else:
    print(f"ERROR!   Quandstats-html file {fullFileHtml} MISSING so something went wrong plotting/writing it!")

time.sleep(10)


