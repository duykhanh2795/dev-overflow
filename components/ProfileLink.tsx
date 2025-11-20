import Image from "next/image";
import Link from "next/link";

const ProfileLink = ({
  title,
  href,
  img,
}: {
  title: string;
  href?: string;
  img: string;
}) => {
  return (
    <div className="flex-center gap-1">
      <Image src={img} alt={title} width={20} height={20} />
      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link-100"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark300_light900">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
