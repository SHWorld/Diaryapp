import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Button, Image, Text, Heading } from "@chakra-ui/react";

function DiaryList({ pages, deletePage }) {
  const navigate = useNavigate();

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        ページ一覧
      </Text>
      {pages.length === 0 ? (
        <Text textAlign="center">日記はありません</Text>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {pages.map((page) => (
            <Box
              key={page.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              boxShadow="md"
              bg="white"
            >
              <Heading as="h3" size="md" mb={2} textAlign="center">
                {page.title}
              </Heading>
              <Text noOfLines={3} mb={2} textAlign="center">
                {page.body}
              </Text>
              {page.image && (
                <Image
                  src={page.image}
                  alt="投稿画像"
                  boxSize="150px"
                  objectFit="cover"
                  mb={2}
                />
              )}
              <Text mb={2}>{page.page_date}</Text>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => navigate(`/diary/edit/${page.id}`)}
                mr={2}
              >
                編集
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => {
                  if (window.confirm("本当に削除しますか？")) {
                    deletePage(page.id);
                  }
                }}
              >
                削除
              </Button>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default DiaryList;
