if (("$#" < 1)); then
    echo "Error: At least 1 component is required"
    echo "Usage: component COMPONENT_NAME..."
fi

for arg in "$@"; do
    touch "src/$arg.jsx" "src/$arg.scss"

    template=$(cat << EOF
import "./$arg.scss"

export default function $arg() {
  return <></>;
}
EOF
)

    echo "$template" > "src/$arg.jsx"
done
