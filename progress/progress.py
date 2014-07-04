# -*- coding: utf-8 -*-
"""
Created on Fri Jul  4 15:40:10 2014

@author: jsousa
"""

from IPython.display import display,Javascript

class NBProgress():
    def __init__(self):
        self.progress = 0.0
    
    def add(self,delta):
        self.progress += delta
        self._send()

    def set(self,prog):
        self.progress = prog
        self._send()

    def _send(self):
        display('PROG',metadata={'progress':self.progress})
            
