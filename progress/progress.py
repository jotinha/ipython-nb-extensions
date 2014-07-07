# -*- coding: utf-8 -*-
"""
Created on Fri Jul  4 15:40:10 2014

@author: jsousa
"""

from IPython.display import display,Javascript

class NBProgress(object):

    def __init__(self):
        self._progress = 0.0    
        
    @property
    def value(self):
        return self._progress
    
    @value.setter
    def value(self,p):
        p = 0 if p < 0 else 1 if p > 1 else p
        self._progress = p
        self._send()

    def __add__(self,d):
        self.value += d
        return self

    def __sub__(self,d):
        self.value -= d
        return self

    def set(self,p):
        self.value = p
        
    def _send(self):
        #print "Sending " + str(self._progress)
        display('PROG',metadata={'progress':self.value})
