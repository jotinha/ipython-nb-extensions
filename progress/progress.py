# -*- coding: utf-8 -*-
"""
Created on Fri Jul  4 15:40:10 2014

@author: jsousa
"""

from IPython.display import display,Javascript

def _sendMsg(type,data):
    display('MSG',metadata={'type':type,'data':data})
    #print "Sending message %s: %s" % (type,data)
   
def setCellProgress(prog):
    """
    Sets the current cell progress in an IPython notebook to a new value.

    Expects a number between 0 and 1.
    """
    _sendMsg('setCellProgress',float(prog))
   
def addCellProgress(delta):
    """
    Updates the current cell progress in an IPython notebook by an amount delta.
    """
    _sendMsg('addCellProgress',float(delta))
