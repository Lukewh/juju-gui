#! /bin/bash

PLATFORM=`uname -a | cut -f 1 -d " "`

if [ "$PLATFORM" = "Darwin" ]; then
    echo "Mac install"

    MULTIPASS="ubuntu"
else
    echo "Ubuntu install"

    MULTIPASS="multipass.ubuntu"
fi

# If initial run
if [ -z $1 ]; then
    echo "Creating xenial machine. This may take some time."
    echo "$MULTIPASS create xenial | tail -1 | cut -f 2 -d ' '"
    MACHINE=$($MULTIPASS create xenial | tail -1 | cut -f 2 -d " ")

    if [ -z $MACHINE ]; then
        exit 1
    fi

    echo "$MACHINE created"

    sleep 60

    LOCALUUID=$(id -u `whoami`)
    echo "$LOCALUUID - local user uuid"

    {
        echo "Mounting $PWD"
        $MULTIPASS mount --uid-map $(id -u $USERNAME):1000 $PWD ${MACHINE}:/home/ubuntu/jujugui
        echo "$PWD mounted to ${MACHINE}:~/jujugui"
    } || {
        echo "Could not mount."
        exit 1;
    }

# If external run
else
    $MULTIPASS exec $1 -- sudo apt install snapd make
    $MULTIPASS exec $1 -- sudo snap install juju --classic --edge
    $MULTIPASS exec $1 -- sudo snap install lxd
    $MULTIPASS exec $1 -- make -C /home/ubuntu/jujugui sysdeps deps run
fi