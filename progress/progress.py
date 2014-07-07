# -*- coding: utf-8 -*-
"""
Created on Fri Jul  4 15:40:10 2014

@author: jsousa
"""

from IPython.display import display,Javascript

def _sendMsg(type,data):
    display('MSG',metadata={'type':type,'data':data})
    #print "Sending message %s: %s" % (type,data)
   
def setCellProgress(p):
    _sendMsg('setCellProgress',float(p))
   
def addCellProgress(d):
    _sendMsg('addCellProgress',float(d))
