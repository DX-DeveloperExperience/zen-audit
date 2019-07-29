for script in $PWD*.sh
do
    [ "$script" != "./run_all.sh" ] && $script
done
