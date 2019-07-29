for script in ./*.sh
do
    [ "$script" != "./run_all.sh" ] && $script
done