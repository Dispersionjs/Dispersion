<img src="https://images.prismic.io/dot-online/2db5f64f-a9d4-44b2-a614-50dc9fba5165_dispersion_min.jpg?auto=compress,format" width="100"/>


#Dispersion

A desktop application that allows users to save files on their IPFS local node. 

##Getting Started

Please install IPFS before using Dispersion. You can download IPFS from the following link: https://ipfs.io/docs/install/


Installation
------------

```
git clone https://github.com/Dispersionjs/Dispersion.git
cd Dispersion/app
npm run install:dispersion
npm start
```


## Dashboard Page

This page is used to view and add files or entire applications to IPFS.
These files can then be staged for publish, downloaded or deleted from Dispersion.

## Publish 

Once a file is staged it appears on the publish page, where it can then be publish to your ipfs node's fixed IPNS.
Selecting the  + icon will publish to your IPNS. This can be mapped to a specific domain name.

When selecting the pencil icon, the user can edit and save individual project files as well as manage a complete version history.


## Settings

The settings can be accessed by clicking the gear icon in the top right corner of the application.

The settings displays the users peerID, and MultAddr address(used to allow peers to add you to their trusted bootstrap list). It also allows you to add peers to your list as well as check the health of any content on ipfs, by displaying the number of nodes that have pinned the content.
